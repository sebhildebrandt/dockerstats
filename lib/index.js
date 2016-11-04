'use strict';
// ==================================================================================
// index.js
// ----------------------------------------------------------------------------------
// Description:   Docker Statistics - library
//                for Node.js
// Copyright:     (c) 2016
// Author:        Sebastian Hildebrandt
// ----------------------------------------------------------------------------------
// License:       MIT
// ==================================================================================
//
// Installation
// --------------------------------
//
// # npm install dockerstats --save
//
// ==================================================================================
//
// Usage
// --------------------------------
// All functions are asynchronous functions. Here a small example how to use them:
//
//
// var dockerstats = require('dockerstats');
//
// // callback style
// dockerstats.dockerContainers(function(data) {
//   console.log('Docker Containers');
//   console.log(data);
// })
//
// // promises style
// dockerstats.dockerContainers()
//   .then(data => console.log(data))
// .catch(error => console.error(error));
//
// ==================================================================================
//
// Comments
// --------------------------------
//
// This library is still work in progress. You can use them like before with callbacks OR
// with promises (see documentation below. I am sure, there is for sure room for improvement.
//
// Comments, suggestions & reports are very welcome!
//
// ==================================================================================
//
// Version history
// --------------------------------
//
// version	date	      comment
// 1.0.0    2016-11-04	initial release
//
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
exports.dockerContainers = docker.dockerContainers;
exports.dockerContainerStats = docker.dockerContainerStats;
exports.dockerContainerProcesses = docker.dockerContainerProcesses;
exports.dockerAll = docker.dockerAll;
