const { test, beforeEach } = require("node:test");
const assert = require("node:assert");

const responses = {};
const calls = [];

class FakeDockerSocket {
	getInfo(cb) {
		calls.push(["getInfo"]);
		cb(responses.info);
	}
	listImages(all, cb) {
		calls.push(["listImages", all]);
		cb(responses.images);
	}
	inspectImage(id, cb) {
		calls.push(["inspectImage", id]);
		cb(responses.imageInspect);
	}
	listContainers(all, cb) {
		calls.push(["listContainers", all]);
		cb(responses.containers);
	}
	getStats(id, cb) {
		calls.push(["getStats", id]);
		cb(responses.stats);
	}
	getInspect(id, cb) {
		calls.push(["getInspect", id]);
		cb(responses.containerInspect);
	}
	getProcesses(id, cb) {
		calls.push(["getProcesses", id]);
		cb(responses.processes);
	}
	listVolumes(cb) {
		calls.push(["listVolumes"]);
		cb(responses.volumes);
	}
}

const socketModulePath = require.resolve("../lib/dockerSocket");
require.cache[socketModulePath] = {
	id: socketModulePath,
	filename: socketModulePath,
	loaded: true,
	exports: FakeDockerSocket,
	children: [],
	paths: [],
};

const dockerstats = require("../lib/index");

const CONTAINER_ID = "a".repeat(64);
const IMAGE_ID = `sha256:${"b".repeat(64)}`;
const epoch = (iso) => Math.round(new Date(iso).getTime() / 1000);

function containerListEntry() {
	return {
		Id: CONTAINER_ID,
		Names: ["/web"],
		Image: "nginx:latest",
		ImageID: IMAGE_ID,
		Command: "nginx -g daemon off;",
		Created: 1700000000,
		State: "running",
		Ports: [{ PrivatePort: 80, PublicPort: 8080, Type: "tcp" }],
		Mounts: [],
	};
}

function containerInspectResponse() {
	return {
		Created: "2024-01-01T00:00:00Z",
		RestartCount: 3,
		Platform: "linux",
		Driver: "overlay2",
		Config: {
			Labels: {
				"org.label-schema.license": "MIT",
				"org.label-schema.schema-version": "1.0",
			},
		},
		State: {
			StartedAt: "2024-01-01T00:00:10Z",
			FinishedAt: "0001-01-01T00:00:00Z",
		},
	};
}

function statsResponse() {
	return {
		id: CONTAINER_ID,
		memory_stats: { usage: 100, limit: 200 },
		cpu_stats: {
			cpu_usage: { total_usage: 400 },
			system_cpu_usage: 2000,
			online_cpus: 2,
		},
		precpu_stats: {
			cpu_usage: { total_usage: 200 },
			system_cpu_usage: 1000,
			online_cpus: 2,
		},
		pids_stats: { current: 5 },
		networks: {
			eth0: { rx_bytes: 100, tx_bytes: 10 },
			eth1: { rx_bytes: 50, tx_bytes: 5 },
		},
		blkio_stats: {
			io_service_bytes_recursive: [
				{ op: "Read", value: 10 },
				{ op: "Write", value: 20 },
				{ op: "read", value: 5 },
			],
		},
	};
}

beforeEach(() => {
	calls.length = 0;
	responses.info = {};
	responses.images = [];
	responses.imageInspect = {};
	responses.containers = [];
	responses.containerInspect = {};
	responses.stats = {};
	responses.processes = {};
	responses.volumes = {};
});

test("version returns the package version", () => {
	assert.strictEqual(
		dockerstats.version(),
		require("../package.json").version,
	);
});

test("dockerInfo maps daemon fields to camelCase", async () => {
	responses.info = {
		ID: "info-id",
		Containers: 3,
		ContainersRunning: 2,
		Images: 7,
		Driver: "overlay2",
		NCPU: 8,
		MemTotal: 1024,
		ServerVersion: "29.0",
		Labels: ["a=b"],
	};
	const data = await dockerstats.dockerInfo();
	assert.strictEqual(data.id, "info-id");
	assert.strictEqual(data.containers, 3);
	assert.strictEqual(data.containersRunning, 2);
	assert.strictEqual(data.images, 7);
	assert.strictEqual(data.driver, "overlay2");
	assert.strictEqual(data.ncpu, 8);
	assert.strictEqual(data.memTotal, 1024);
	assert.strictEqual(data.serverVersion, "29.0");
	assert.deepStrictEqual(data.labels, ["a=b"]);
});

test("dockerInfo resolves on empty daemon response", async () => {
	const data = await dockerstats.dockerInfo();
	assert.strictEqual(typeof data, "object");
	assert.strictEqual(data.id, undefined);
});

test("dockerImages maps list and inspect data", async () => {
	responses.images = [{ Id: IMAGE_ID, SharedSize: 7 }];
	responses.imageInspect = {
		Container: "ctr",
		Comment: "c",
		Os: "linux",
		Architecture: "arm64",
		Parent: "",
		DockerVersion: "29.0",
		Size: 123,
		VirtualSize: 456,
		Author: "me",
		Created: "2024-01-01T00:00:00Z",
		RepoTags: ["nginx:latest"],
	};
	const data = await dockerstats.dockerImages();
	assert.strictEqual(data.length, 1);
	assert.strictEqual(data[0].id, IMAGE_ID);
	assert.strictEqual(data[0].os, "linux");
	assert.strictEqual(data[0].architecture, "arm64");
	assert.strictEqual(data[0].size, 123);
	assert.strictEqual(data[0].sharedSize, 7);
	assert.strictEqual(data[0].created, epoch("2024-01-01T00:00:00Z"));
	assert.deepStrictEqual(data[0].repoTags, ["nginx:latest"]);
	assert.deepStrictEqual(data[0].repoDigests, []);
	assert.deepStrictEqual(calls[0], ["listImages", false]);
	assert.deepStrictEqual(calls[1], ["inspectImage", IMAGE_ID]);
});

test("dockerImages passes all flag and supports callback style", async () => {
	responses.images = [];
	const viaCallback = new Promise((resolve) => {
		dockerstats.dockerImages(true, resolve);
	});
	assert.deepStrictEqual(await viaCallback, []);
	assert.deepStrictEqual(calls[0], ["listImages", true]);
});

test("dockerImages returns empty array on non-array response", async () => {
	responses.images = { message: "error" };
	assert.deepStrictEqual(await dockerstats.dockerImages(), []);
});

test("dockerImages skips entries without Id", async () => {
	responses.images = [{ SharedSize: 1 }];
	assert.deepStrictEqual(await dockerstats.dockerImages(), []);
});

test("dockerContainers maps list and inspect data", async () => {
	responses.containers = [containerListEntry()];
	responses.containerInspect = containerInspectResponse();
	const data = await dockerstats.dockerContainers();
	assert.strictEqual(data.length, 1);
	const c = data[0];
	assert.strictEqual(c.id, CONTAINER_ID);
	assert.strictEqual(c.name, "web");
	assert.strictEqual(c.image, "nginx:latest");
	assert.strictEqual(c.imageID, IMAGE_ID);
	assert.strictEqual(c.command, "nginx -g daemon off;");
	assert.strictEqual(c.created, 1700000000);
	assert.strictEqual(c.started, epoch("2024-01-01T00:00:10Z"));
	assert.strictEqual(c.finished, 0);
	assert.strictEqual(c.finishedAt, "");
	assert.strictEqual(c.state, "running");
	assert.strictEqual(c.restartCount, 3);
	assert.strictEqual(c.platform, "linux");
	assert.strictEqual(c.driver, "overlay2");
	assert.deepStrictEqual(c.labels, {
		"org.label-schema.license": "MIT",
		"org.label-schema.schema-version": "1.0",
	});
	assert.deepStrictEqual(c.ports, [
		{ PrivatePort: 80, PublicPort: 8080, Type: "tcp" },
	]);
});

test("dockerContainers passes all flag and callback-only style", async () => {
	responses.containers = [];
	const viaCallback = new Promise((resolve) => {
		dockerstats.dockerContainers(resolve);
	});
	assert.deepStrictEqual(await viaCallback, []);
	assert.deepStrictEqual(calls[0], ["listContainers", false]);
	calls.length = 0;
	await dockerstats.dockerContainers(true);
	assert.deepStrictEqual(calls[0], ["listContainers", true]);
});

test("dockerContainers returns empty array on non-array response", async () => {
	responses.containers = { message: "error" };
	assert.deepStrictEqual(await dockerstats.dockerContainers(), []);
});

test("dockerContainerStats computes stats for one container", async () => {
	responses.stats = statsResponse();
	responses.containerInspect = containerInspectResponse();
	const data = await dockerstats.dockerContainerStats(CONTAINER_ID);
	assert.strictEqual(data.length, 1);
	const s = data[0];
	assert.strictEqual(s.id, CONTAINER_ID);
	assert.strictEqual(s.memUsage, 100);
	assert.strictEqual(s.memLimit, 200);
	assert.strictEqual(s.memPercent, 50);
	assert.strictEqual(s.cpuPercent, 40);
	assert.strictEqual(s.pids, 5);
	assert.strictEqual(s.restartCount, 3);
	assert.deepStrictEqual(s.netIO, { rx: 150, wx: 15 });
	assert.deepStrictEqual(s.blockIO, { r: 15, w: 20 });
	assert.deepStrictEqual(s.networks, statsResponse().networks);
});

test("dockerContainerStats sanitizes and splits comma-separated ids", async () => {
	responses.stats = statsResponse();
	const data = await dockerstats.dockerContainerStats("  ABC,def<>&; ");
	assert.strictEqual(data.length, 2);
	const statIds = calls
		.filter((c) => c[0] === "getStats")
		.map((c) => c[1]);
	assert.deepStrictEqual(statIds, ["abc", "def"]);
});

test("dockerContainerStats with * resolves all running containers", async () => {
	responses.containers = [containerListEntry()];
	responses.containerInspect = containerInspectResponse();
	responses.stats = statsResponse();
	const data = await dockerstats.dockerContainerStats("*");
	assert.strictEqual(data.length, 1);
	assert.strictEqual(data[0].id, CONTAINER_ID);
	const statIds = calls
		.filter((c) => c[0] === "getStats")
		.map((c) => c[1]);
	assert.deepStrictEqual(statIds, [CONTAINER_ID.substring(0, 12)]);
});

test("dockerContainerStats rejects non-string and traversal input", async () => {
	assert.deepStrictEqual(await dockerstats.dockerContainerStats(42), []);
	assert.deepStrictEqual(
		await dockerstats.dockerContainerStats("x/../../etc"),
		[],
	);
	assert.deepStrictEqual(
		calls.filter((c) => c[0] === "getStats"),
		[],
	);
});

test("dockerContainerStats returns defaults on daemon error message", async () => {
	responses.stats = { message: "No such container" };
	const data = await dockerstats.dockerContainerStats("deadbeef1234");
	assert.strictEqual(data.length, 1);
	assert.strictEqual(data[0].memUsage, 0);
	assert.strictEqual(data[0].cpuPercent, 0);
	assert.deepStrictEqual(data[0].netIO, { rx: 0, wx: 0 });
});

test("dockerContainerProcesses maps process titles to fields", async () => {
	responses.processes = {
		Titles: [
			"PID",
			"PPID",
			"PGID",
			"VSZ",
			"TIME",
			"ELAPSED",
			"NI",
			"RUSER",
			"USER",
			"RGROUP",
			"GROUP",
			"STAT",
			"RSS",
			"COMMAND",
		],
		Processes: [
			[
				"1",
				"0",
				"1",
				"1000",
				"00:00:01",
				"01:00",
				"0",
				"root",
				"root",
				"root",
				"root",
				"Ss",
				"500",
				"node server.js",
			],
		],
	};
	const data = await dockerstats.dockerContainerProcesses(CONTAINER_ID);
	assert.strictEqual(data.length, 1);
	const p = data[0];
	assert.strictEqual(p.pidHost, "1");
	assert.strictEqual(p.ppid, "0");
	assert.strictEqual(p.pgid, "1");
	assert.strictEqual(p.vsz, "1000");
	assert.strictEqual(p.time, "00:00:01");
	assert.strictEqual(p.elapsed, "01:00");
	assert.strictEqual(p.nice, "0");
	assert.strictEqual(p.user, "root");
	assert.strictEqual(p.stat, "Ss");
	assert.strictEqual(p.rss, "500");
	assert.strictEqual(p.command, "node server.js");
});

test("dockerContainerProcesses handles invalid ids and empty responses", async () => {
	assert.deepStrictEqual(await dockerstats.dockerContainerProcesses(42), []);
	assert.deepStrictEqual(
		await dockerstats.dockerContainerProcesses("x/../../images"),
		[],
	);
	assert.deepStrictEqual(
		await dockerstats.dockerContainerProcesses(CONTAINER_ID),
		[],
	);
});

test("dockerVolumes maps volume data", async () => {
	responses.volumes = {
		Volumes: [
			{
				Name: "data",
				Driver: "local",
				Labels: { a: "b" },
				Mountpoint: "/var/lib/docker/volumes/data",
				Options: null,
				Scope: "local",
				CreatedAt: "2024-01-01T00:00:00Z",
			},
		],
	};
	const data = await dockerstats.dockerVolumes();
	assert.strictEqual(data.length, 1);
	assert.strictEqual(data[0].name, "data");
	assert.strictEqual(data[0].driver, "local");
	assert.strictEqual(data[0].mountpoint, "/var/lib/docker/volumes/data");
	assert.strictEqual(data[0].scope, "local");
	assert.strictEqual(data[0].created, epoch("2024-01-01T00:00:00Z"));
});

test("dockerVolumes returns empty array when no volumes exist", async () => {
	responses.volumes = { Volumes: null };
	assert.deepStrictEqual(await dockerstats.dockerVolumes(), []);
});

test("dockerAll merges containers, stats and processes", async () => {
	responses.containers = [containerListEntry()];
	responses.containerInspect = containerInspectResponse();
	responses.stats = statsResponse();
	responses.processes = {
		Titles: ["PID", "COMMAND"],
		Processes: [["1", "node server.js"]],
	};
	const data = await dockerstats.dockerAll();
	assert.strictEqual(data.length, 1);
	const c = data[0];
	assert.strictEqual(c.id, CONTAINER_ID);
	assert.strictEqual(c.name, "web");
	assert.strictEqual(c.memUsage, 100);
	assert.strictEqual(c.cpuPercent, 40);
	assert.deepStrictEqual(c.netIO, { rx: 150, wx: 15 });
	assert.strictEqual(c.processes.length, 1);
	assert.strictEqual(c.processes[0].command, "node server.js");
	assert.deepStrictEqual(calls[0], ["listContainers", true]);
});

test("dockerAll resolves empty array without containers", async () => {
	responses.containers = [];
	assert.deepStrictEqual(await dockerstats.dockerAll(), []);
});
