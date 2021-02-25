'use strict';
// ==================================================================================
// index.js
// ----------------------------------------------------------------------------------
// Description:   Docker Statistics - library
//                for Node.js
// Copyright:     (c) 2016 - 2021
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
exports.dockerImages = docker.dockerImages;
exports.dockerContainers = docker.dockerContainers;
exports.dockerContainerStats = docker.dockerContainerStats;
exports.dockerContainerProcesses = docker.dockerContainerProcesses;
exports.dockerVolumes = docker.dockerVolumes;
exports.dockerAll = docker.dockerAll;
