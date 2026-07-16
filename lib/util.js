function sanitizeContainerID(str) {
	const s = String(str || "")
		.substring(0, 2000)
		.replace(/[^a-zA-Z0-9_.,*-]/g, "");
	return s.indexOf("..") === -1 ? s : "";
}

function sanitizeImageID(str) {
	const s = String(str || "")
		.substring(0, 2000)
		.replace(/[^a-zA-Z0-9_.,:@/-]/g, "");
	return s.indexOf("..") === -1 ? s : "";
}

function isFunction(functionToCheck) {
	const getType = {};
	return (
		functionToCheck &&
		getType.toString.call(functionToCheck) === "[object Function]"
	);
}

function nanoSeconds() {
	const time = process.hrtime();
	if (!Array.isArray(time) || time.length !== 2) {
		return 0;
	}
	return +time[0] * 1e9 + +time[1];
}

function noop() {}

exports.isFunction = isFunction;
exports.nanoSeconds = nanoSeconds;
exports.noop = noop;
exports.sanitizeContainerID = sanitizeContainerID;
exports.sanitizeImageID = sanitizeImageID;
