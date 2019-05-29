'use strict';
// ==================================================================================
// index.js
// ----------------------------------------------------------------------------------
// Description:   Docker Statistics - library
//                for Node.js
// Copyright:     (c) 2016 - 2019
// Author:        Sebastian Hildebrandt
// ----------------------------------------------------------------------------------
// License:       MIT
// ==================================================================================

// ----------------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------------

const lib_version = require('../package.json').version;
const docker = require('./docker');

// ----------------------------------------------------------------------------------
// 1. General
// ----------------------------------------------------------------------------------

function version() {
  return lib_version;
}
// ----------------------------------------------------------------------------------
// export all libs
// ----------------------------------------------------------------------------------

exports.version = version;
exports.dockerInfo = docker.dockerInfo;
exports.dockerContainers = docker.dockerContainers;
exports.dockerContainerStats = docker.dockerContainerStats;
exports.dockerContainerProcesses = docker.dockerContainerProcesses;
exports.dockerAll = docker.dockerAll;
