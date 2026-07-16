const os = require("node:os");
const path = require("node:path");
const fs = require("node:fs");
const net = require("node:net");
const { test } = require("node:test");
const assert = require("node:assert");

const SOCK = path.join(os.tmpdir(), `dockerstats-test-${process.pid}.sock`);
process.env.DOCKER_SOCKET = SOCK;
process.env.DOCKER_SOCKET_TIMEOUT = "250";

const DockerSocket = require("../lib/dockerSocket");

function startServer(onData) {
	fs.rmSync(SOCK, { force: true });
	const sockets = new Set();
	const server = net.createServer((conn) => {
		sockets.add(conn);
		conn.on("close", () => sockets.delete(conn));
		conn.on("data", (chunk) => onData(conn, chunk.toString()));
	});
	return new Promise((resolve) => {
		server.listen(SOCK, () => {
			resolve(
				() =>
					new Promise((done) => {
						for (const s of sockets) {
							s.destroy();
						}
						server.close(done);
					}),
			);
		});
	});
}

function call(method, ...args) {
	return new Promise((resolve) => {
		const ds = new DockerSocket();
		ds[method](...args, resolve);
	});
}

test("parses 2xx JSON response", async () => {
	const stop = await startServer((conn) =>
		conn.end(
			'HTTP/1.0 200 OK\r\nContent-Type: application/json\r\n\r\n{"ServerVersion":"29.0"}',
		),
	);
	const data = await call("getInfo");
	assert.deepStrictEqual(data, { ServerVersion: "29.0" });
	await stop();
});

test("sends expected request path", async () => {
	let request = "";
	const stop = await startServer((conn, chunk) => {
		request = chunk;
		conn.end("HTTP/1.0 200 OK\r\n\r\n{}");
	});
	await call("getStats", "abc123");
	assert.ok(request.startsWith("GET http:/containers/abc123/stats?stream=0"));
	await stop();
});

test("returns empty object on non-2xx status", async () => {
	const stop = await startServer((conn) =>
		conn.end(
			'HTTP/1.0 404 Not Found\r\n\r\n{"message":"No such container"}',
		),
	);
	const data = await call("getInspect", "nope");
	assert.deepStrictEqual(data, {});
	await stop();
});

test("returns empty object on invalid JSON", async () => {
	const stop = await startServer((conn) =>
		conn.end("HTTP/1.0 200 OK\r\n\r\nnot-json"),
	);
	const data = await call("listVolumes");
	assert.deepStrictEqual(data, {});
	await stop();
});

test("returns empty object on malformed response without header separator", async () => {
	const stop = await startServer((conn) => conn.end("garbage"));
	const data = await call("getInfo");
	assert.deepStrictEqual(data, {});
	await stop();
});

test("times out when the daemon does not respond", async () => {
	const stop = await startServer(() => {});
	const t0 = Date.now();
	const data = await call("getInfo");
	assert.deepStrictEqual(data, {});
	assert.ok(Date.now() - t0 < 5000);
	await stop();
});

test("returns empty object when the socket does not exist", async () => {
	fs.rmSync(SOCK, { force: true });
	const data = await call("getInfo");
	assert.deepStrictEqual(data, {});
});

test("invokes the callback exactly once on abrupt close", async () => {
	const stop = await startServer((conn) => {
		conn.write("HTTP/1.0 200 OK\r\n\r\n{}");
		conn.destroy();
	});
	let count = 0;
	await new Promise((resolve) => {
		new DockerSocket().getInfo(() => {
			count += 1;
			setTimeout(resolve, 300);
		});
	});
	assert.strictEqual(count, 1);
	await stop();
});

test("id-based methods short-circuit on empty id", async () => {
	for (const method of [
		"inspectImage",
		"getStats",
		"getInspect",
		"getProcesses",
	]) {
		const data = await call(method, "");
		assert.deepStrictEqual(data, {});
	}
});
