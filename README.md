# dockerstats

Simple [Docker][docker-url] info and stats library for [node.js][nodejs-url]

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  [![Git Issues][issues-img]][issues-url]
  [![deps status][daviddm-img]][daviddm-url]
  [![Code Quality: Javascript][lgtm-badge]][lgtm-badge-url]
  [![Total alerts][lgtm-alerts]][lgtm-alerts-url]
  [![Caretaker][caretaker-image]][caretaker-url]
  [![MIT license][license-img]][license-url]

## New Version 2

Version 2 just released with several security fixes, improvements and changes.
### Breaking Changes Version 2

**Be aware**, that the new version 2.x **is NOT fully backward compatible** to version 1.x ...

We had to make **several interface changes** to keep dockerStats as consistent as possible. We highly recommend to go through the complete list and adapt your own code to be again compatible to the new version 2.

| Function        | Old                | New (V5)           | Comments           |
| --------------- | ------------------ | ------------------ | ------------------ |
| `dockerContainerStats()` | mem_usage<br>mem_limit<br>mem_percent<br>cpu_percent<br>cpu_stats<br>precpu_stats<br>memory_stats | memUsage<br>memLimit<br>memPercent<br>cpuPercent<br>cpuStats<br>precpuStats<br>memoryStats | pascalCase conformity |
| `dockerContainerProcesses()` | pid_host | pidHost | pascalCase conformity |

## Quick Start

Collection of a few functions to retrieve detailed docker statistics. With this package you easily can retrieve

- list of top level/all docker images
- list of active/all docker containers
- statistics for a specific container (mem, cpu, network and blockIO stats)
- information of all processes of a specific active docker container (pids, state, cpu-time, user...)

Super simple to use with callback functions or promise style.

### Installation

```bash
$ npm install dockerstats --save
```

### Usage

All functions are implemented as asynchronous functions. Here a small example how to use them:

```js
const dockerstats = require('dockerstats');

// callback style
dockerstats.dockerContainers(function(data) {
	console.log('Docker Containers');
	console.log(data);
})

// promises style
dockerstats.dockerContainers()
	.then(data => console.log(data))
	.catch(error => console.error(error));

// full async / await example (node >= 7.6)
async function dockerContainers() {
  try {
    const data = await dockerstats.dockerContainers();
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}

```

## Core concept

[Docker][docker-url] comes with a API to control Docker and retrieve detailes information. So I came up to write this
little library to collect some docker statistics. This library is still work in progress. I am sure, there is for sure room for improvement.
Tested on several Debian, Raspbian, Ubuntu distributions, OS X (Mavericks, Yosemite, El Captain, Sierra, High Sierra, Mojave).

If you have comments, suggestions & reports, please feel free to contact me!

I also created a full blown system information library (including all docker stats) called [systeminformation][systeminformation-github-url], also available via [github][systeminformation-github-url] and [npm][systeminformation-npm-url].

## Reference

### Function Reference and OS Support

| Function        | Result object | Comments |
| --------------- | ------------- | -------- |
| si.dockerInfo(cb) | {...} | returns general docker info |
| | id | Docker ID |
| | containers | number of containers |
| | containersRunning | number of running containers |
| | containersPaused | number of paused containers |
| | containersStopped | number of stopped containers |
| | images | number of images |
| | driver | driver (e.g. 'devicemapper', 'overlay2') |
| | memoryLimit | has memory limit |
| | swapLimit | has swap limit |
| | kernelMemory | has kernal memory |
| | cpuCfsPeriod | has CpuCfsPeriod |
| | cpuCfsQuota | has CpuCfsQuota |
| | cpuShares | has CPUShares |
| | cpuSet | has CPUShares |
| | ipv4Forwarding | has IPv4Forwarding |
| | bridgeNfIptables | has BridgeNfIptables |
| | bridgeNfIp6tables | has BridgeNfIp6tables |
| | debug | Debug on |
| | nfd | named data networking forwarding daemon |
| | oomKillDisable | out-of-memory kill disabled |
| | ngoroutines | number NGoroutines |
| | systemTime | docker SystemTime |
| | loggingDriver | logging driver e.g. 'json-file' |
| | cgroupDriver | cgroup driver e.g. 'cgroupfs' |
| | nEventsListener | number NEventsListeners |
| | kernelVersion | docker kernel version |
| | operatingSystem | docker OS e.g. 'Docker for Mac' |
| | osType | OSType e.g. 'linux' |
| | architecture | architecture e.g. x86_64 |
| | ncpu | number of CPUs |
| | memTotal | memory total |
| | dockerRootDir | docker root directory |
| | httpProxy | http proxy |
| | httpsProxy | https proxy |
| | noProxy | NoProxy |
| | name | Name |
| | labels | array of labels |
| | experimentalBuild | is experimental build |
| | serverVersion | server version |
| | clusterStore | cluster store |
| | clusterAdvertise | cluster advertise |
| | defaultRuntime | default runtime e.g. 'runc' |
| | liveRestoreEnabled | live store enabled |
| | isolation | isolation |
| | initBinary | init binary |
| | productLicense | product license |
| si.dockerImages(all, cb) | [{...}] | returns array of top level/all docker images |
| | [0].id | image ID |
| | [0].container | container ID |
| | [0].comment | comment |
| | [0].os | OS |
| | [0].architecture | architecture |
| | [0].parent | parent ID |
| | [0].dockerVersion | docker version |
| | [0].size | image size |
| | [0].sharedSize | shared size |
| | [0].virtualSize | virtual size |
| | [0].author | author |
| | [0].created | created date / time |
| | [0].containerConfig | container config object |
| | [0].graphDriver | graph driver object |
| | [0].repoDigests | repo digests array |
| | [0].repoTags | repo tags array |
| | [0].config | config object |
| | [0].rootFS | root fs object |
| si.dockerContainers(all, cb) | [{...}] | returns array of active/all docker containers |
| | [0].id | ID of container |
| | [0].name | name of container |
| | [0].image | name of image |
| | [0].imageID | ID of image |
| | [0].command | command |
| | [0].created | creation time (unix) |
| | [0].started | creation time (unix) |
| | [0].finished | creation time (unix) |
| | [0].createdAt | creation date time string |
| | [0].startedAt | creation date time string |
| | [0].finishedAt | creation date time string |
| | [0].state | created, running, exited |
| | [0].ports | array of ports |
| | [0].mounts | array of mounts |
| si.dockerContainerStats(ids, cb) | [{...}] | statistics for specific containers<br>container IDs: space or comma separated,<br>pass '*' for all containers|
| | [0].id | Container ID |
| | [0].memUsage | memory usage in bytes |
| | [0].memLimit | memory limit (max mem) in bytes |
| | [0].memPercent | memory usage in percent |
| | [0].cpuPercent | cpu usage in percent |
| | [0].pids | number of processes |
| | [0].netIO.rx | received bytes via network |
| | [0].netIO.wx | sent bytes via network |
| | [0].blockIO.r | bytes read from BlockIO |
| | [0].blockIO.w | bytes written to BlockIO |
| | [0].cpuStats | detailed cpu stats |
| | [0].percpuStats | detailed per cpu stats |
| | [0].memoryStats | detailed memory stats |
| | [0].networks | detailed network stats per interface |
| si.dockerContainerProcesses(id, cb) | [{...}] | array of processes inside a container |
| | [0].pid_host | process ID (host) |
| | [0].ppid | parent process ID |
| | [0].pgid | process group ID |
| | [0].user | effective user name |
| | [0].ruser | real user name |
| | [0].group | effective group name |
| | [0].rgroup | real group name |
| | [0].stat | process state |
| | [0].time | accumulated CPU time |
| | [0].elapsed | elapsed running time |
| | [0].nice | nice value |
| | [0].rss | resident set size |
| | [0].vsz | virtual size in Kbytes |
| | [0].command | command and arguments |
| si.dockerAll(cb) | {...} | list of all containers including their stats<br>and processes in one single array |

### cb: Asynchronous Function Calls (callback)

Remember: all functions are implemented as asynchronous functions! There are now two ways to consume them:

**Callback Style**

```js
// assuming you have a container with ID 'ae8a76'

const dockerstats = require('dockerstats');

dockerstats.dockerContainerStats('ae8a76', function(data) {
	console.log('Docker Container Stats:');
	console.log('- ID: ' + data.id);
	console.log('- Mem usage: ' + data.memUsage);
	console.log('- Mem limit: ' + data.memLimit);
	console.log('- Mem usage %: ' + data.memPercent);
	console.log('- CPU usage %: ' + data.cpuPercent);
})
```

### Promises

**Promises Style**

When omitting callback parameter (cb), then you can use all function in a promise oriented way. All functions are returning a promise, that you can consume:

```js
// assuming you have a container with ID 'ae8a76'

const dockerstats = require('dockerstats');

dockerstats.dockerContainerStats('ae8a76')
  .then(data => {
  	console.log('Docker Container Stats:');
  	console.log('- ID: ' + data.id);
  	console.log('- Mem usage: ' + data.memUsage);
  	console.log('- Mem limit: ' + data.memLimit);
  	console.log('- Mem usage %: ' + data.memPercent);
  	console.log('- CPU usage %: ' + data.cpuPercent);
	})
	.catch(error => console.error(error));

```

### Async / Await

**Using async / await** (available since node v7.6)

Since node v7.6 you can also use the `async` / `await` pattern. The above example would then look like this:

```js
// assuming you have a container with ID 'ae8a76'

const dockerstats = require('dockerstats');

async function dockerContainerData() {
    try {
        const data = await dockerstats.dockerContainerStats('ae8a76');
        console.log('Docker Container Stats:');
        console.log('- ID: ' + data.id);
        console.log('- Mem usage: ' + data.memUsage);
        console.log('- Mem limit: ' + data.memLimit);
        console.log('- Mem usage %: ' + data.memPercent);
        console.log('- CPU usage %: ' + data.cpuPercent);
        console.log('...');
    } catch (e) {
        console.log(e)
    }
}
```

## Version history

| Version        | Date           | Comment  |
| -------------- | -------------- | -------- |
| 2.1.0          | 2021-02-24     | `dockerImages` added dockerImages to get image data |
| 2.0.2          | 2021-02-23     | `dockerContainerStats` fixed param * |
| 2.0.1          | 2021-02-15     | `dockerContainerStats` fixed ID splitting |
| 2.0.0          | 2021-02-14     | new version 2.0 with security patches, fixes and several updated |
| 1.4.4          | 2021-01-02     | `dockerContainerStats` fix `tx` changed to `wx` as documented |
| 1.4.3          | 2020-12-03     | `typescript` definitions fix |
| 1.4.2          | 2020-10-16     | `dockerContainers()` resolved hanging issue |
| 1.4.1          | 2019-05-31     | `dockerInfo()` changed property naming style |
| 1.4.0          | 2019-05-30     | added typescript definitions, updated docs |
| 1.3.0          | 2019-05-29     | added `dockerInfo()`, `dockerContainers()`<br>added started, finished time, restartCount |
| 1.2.8          | 2018-12-03     | updated package.json (files) |
| 1.2.7          | 2018-12-03     | updated docs |
| 1.2.6          | 2018-11-21     | updated docs |
| 1.2.5          | 2018-11-18     | code cleanup |
| 1.2.4          | 2018-11-18     | bug-fixing - CPU percent calculation (win) |
| 1.2.3          | 2018-11-18     | bug-fixing - CPU percent calculation (linux, win) |
| 1.2.2          | 2018-11-18     | bug-fixing - parsing JSON |
| 1.2.1          | 2018-11-18     | bug-fixing - parsing JSON |
| 1.2.0          | 2018-11-06     | bug-fixing, stabilization, added error handling |
| 1.1.0          | 2017-11-06     | added windows support, dependency version bump |
| 1.0.0          | 2016-11-04     | Initial release |

## Comments

If you have ideas or comments, please do not hesitate to contact me.

Happy monitoring!

Sincerely,

Sebastian Hildebrandt, [+innovations](http://www.plus-innovations.com)

## Credits

Written by Sebastian Hildebrandt [sebhildebrandt](https://github.com/sebhildebrandt)

#### Contributers

- toolcreator [toolcreator](https://github.com/toolcreator)

## Copyright Information

Linux is a registered trademark of Linus Torvalds. macOS, OS X is a registered trademark of Apple Inc.,
Windows is a registered trademark of Microsoft Corporation. Node.js is a trademark of Joyent Inc.,
Intel is a trademark of Intel Corporation. Raspberry Pi is a trademark of the Raspberry Pi Foundation.
Debian is a trademark of the Debian Project. Ubuntu is a trademark of Canonical Ltd., Docker is a trademark of Docker, Inc.
All other trademarks are the property of their respective owners.

## License [![MIT license][license-img]][license-url]

>The [`MIT`][license-url] License (MIT)
>
>Copyright &copy; 2021 Sebastian Hildebrandt, [+innovations](http://www.plus-innovations.com).
>
>Permission is hereby granted, free of charge, to any person obtaining a copy
>of this software and associated documentation files (the "Software"), to deal
>in the Software without restriction, including without limitation the rights
>to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
>copies of the Software, and to permit persons to whom the Software is
>furnished to do so, subject to the following conditions:
>
>The above copyright notice and this permission notice shall be included in
>all copies or substantial portions of the Software.
>
>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
>IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
>FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
>AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
>LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
>OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
>THE SOFTWARE.
>
>Further details see [LICENSE](LICENSE) file.


[npm-image]: https://img.shields.io/npm/v/dockerstats.svg?style=flat-square
[npm-url]: https://npmjs.org/package/dockerstats
[downloads-image]: https://img.shields.io/npm/dm/dockerstats.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/dockerstats

[lgtm-badge]: https://img.shields.io/lgtm/grade/javascript/g/sebhildebrandt/dockerstats.svg?style=flat-square
[lgtm-badge-url]: https://lgtm.com/projects/g/sebhildebrandt/dockerstats/context:javascript
[lgtm-alerts]: https://img.shields.io/lgtm/alerts/g/sebhildebrandt/dockerstats.svg?style=flat-square
[lgtm-alerts-url]: https://lgtm.com/projects/g/sebhildebrandt/dockerstats/alerts

[license-url]: https://github.com/sebhildebrandt/dockerstats/blob/master/LICENSE
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[npmjs-license]: https://img.shields.io/npm/l/dockerstats.svg?style=flat-square
[changelog-url]: https://github.com/sebhildebrandt/dockerstats/blob/master/CHANGELOG.md
[caretaker-url]: https://github.com/sebhildebrandt
[caretaker-image]: https://img.shields.io/badge/caretaker-sebhildebrandt-blue.svg?style=flat-square

[nodejs-url]: https://nodejs.org/en/
[docker-url]: https://www.docker.com/

[daviddm-img]: https://img.shields.io/david/sebhildebrandt/dockerstats.svg?style=flat-square
[daviddm-url]: https://david-dm.org/sebhildebrandt/dockerstats

[issues-img]: https://img.shields.io/github/issues/sebhildebrandt/dockerstats.svg?style=flat-square
[issues-url]: https://github.com/sebhildebrandt/dockerstats/issues
[closed-issues-img]: https://img.shields.io/github/issues-closed-raw/sebhildebrandt/dockerstats.svg?style=flat-square
[closed-issues-url]: https://github.com/sebhildebrandt/dockerstats/issues?q=is%3Aissue+is%3Aclosed

[systeminformation-npm-url]: https://npmjs.org/package/systeminformation
[systeminformation-github-url]: https://github.com/sebhildebrandt/systeminformation
