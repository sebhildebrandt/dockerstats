const { test } = require("node:test");
const assert = require("node:assert");
const util = require("../lib/util");

test("sanitizeContainerID keeps allowed characters", () => {
	assert.strictEqual(
		util.sanitizeContainerID("abc123DEF_.-,*"),
		"abc123DEF_.-,*",
	);
});

test("sanitizeContainerID strips disallowed characters", () => {
	assert.strictEqual(
		util.sanitizeContainerID("a b;c&d|e$f`g'h\"i\r\nj<>?#\\"),
		"abcdefghij",
	);
});

test("sanitizeContainerID rejects path traversal", () => {
	assert.strictEqual(util.sanitizeContainerID("x/../../images/json"), "");
	assert.strictEqual(util.sanitizeContainerID("a..b"), "");
});

test("sanitizeContainerID handles empty and non-string input", () => {
	assert.strictEqual(util.sanitizeContainerID(""), "");
	assert.strictEqual(util.sanitizeContainerID(null), "");
	assert.strictEqual(util.sanitizeContainerID(undefined), "");
	assert.strictEqual(util.sanitizeContainerID(12345), "12345");
});

test("sanitizeContainerID caps length at 2000", () => {
	assert.strictEqual(util.sanitizeContainerID("a".repeat(3000)).length, 2000);
});

test("sanitizeImageID keeps image reference characters", () => {
	assert.strictEqual(util.sanitizeImageID("sha256:abc"), "sha256:abc");
	assert.strictEqual(
		util.sanitizeImageID("registry.io/org/img:tag@sha256:ff"),
		"registry.io/org/img:tag@sha256:ff",
	);
});

test("sanitizeImageID strips disallowed characters and rejects traversal", () => {
	assert.strictEqual(util.sanitizeImageID("a?b#c d;e"), "abcde");
	assert.strictEqual(util.sanitizeImageID("img/../../containers/json"), "");
	assert.strictEqual(util.sanitizeImageID(null), "");
});

test("isFunction detects functions", () => {
	assert.ok(util.isFunction(function () {}));
	assert.ok(!util.isFunction("string"));
	assert.ok(!util.isFunction({}));
	assert.ok(!util.isFunction(null));
	assert.ok(!util.isFunction(undefined));
});

test("nanoSeconds returns a positive number", () => {
	const t = util.nanoSeconds();
	assert.strictEqual(typeof t, "number");
	assert.ok(t > 0);
});

test("noop returns undefined", () => {
	assert.strictEqual(util.noop(), undefined);
});
