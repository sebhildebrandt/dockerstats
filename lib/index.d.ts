// Type definitions for dockerstats
// Project: https://github.com/sebhildebrandt/dockerstats
// Definitions by: sebhildebrandt <https://github.com/sebhildebrandt>

export namespace Dockerstats {

  interface DockerInfoData {
    id: string;
    containers: number;
    containersRunning: number;
    containersPaused: number;
    containersStopped: number;
    images: number;
    driver: string;
    memoryLimit: boolean;
    swapLimit: boolean;
    kernelMemory: boolean;
    cpuCfsPeriod: boolean;
    cpuCfsQuota: boolean;
    cpuShares: boolean;
    cpuSet: boolean;
    ipv4Forwarding: boolean;
    bridgeNfIptables: boolean;
    bridgeNfIp6tables: boolean;
    debug: boolean;
    nfd: number;
    oomKillDisable: boolean;
    ngoroutines: number;
    systemTime: string;
    loggingDriver: string;
    cgroupDriver: string;
    nEventsListener: number;
    kernelVersion: string;
    operatingSystem: string;
    osType: string;
    architecture: string;
    ncpu: number;
    memTotal: number;
    dockerRootDir: string;
    httpProxy: string;
    httpsProxy: string;
    noProxy: string;
    name: string;
    labels: string[];
    experimentalBuild: boolean;
    serverVersion: string;
    clusterStore: string;
    clusterAdvertise: string;
    defaultRuntime: string;
    liveRestoreEnabled: boolean;
    isolation: string;
    initBinary: string;
    productLicense: string;
  }

  interface DockerImageData {
    id: string;
    container: string;
    comment: string;
    os: string;
    architecture: string;
    parent: string;
    dockerVersion: string;
    size: number;
    sharedSize: number;
    virtualSize: number;
    author: string;
    created: number;
    containerConfig: any;
    graphDriver: any;
    repoDigests: any;
    repoTags: any;
    config: any;
    rootFS: any;
  }

  interface DockerContainerData {
    id: string;
    name: string;
    image: string;
    imageID: string;
    command: string;
    created: number;
    started: number;
    finished: number;
    createdAt: string;
    startedAt: string;
    finishedAt: string;
    state: string;
    restartCount: number;
    platform: string;
    driver: string;
    ports: number[];
    mounts: DockerContainerMountData[];
  }

  interface DockerContainerMountData {
    Type: string;
    Source: string;
    Destination: string;
    Mode: string;
    RW: boolean;
    Propagation: string;
  }

  interface DockerContainerStatsData {
    id: string;
    memUsage: number;
    memLimit: number;
    memPercent: number;
    cpuPercent: number;
    pids: number;
    netIO: {
      rx: number;
      wx: number;
    };
    blockIO: {
      r: number;
      w: number;
    };
    restartCount: number;
    cpuStats: any;
    precpuStats: any;
    memoryStats: any;
    networks: any;
  }

  interface DockerContainerProcessData {
    pidHost: string;
    ppid: string;
    pgid: string;
    user: string;
    ruser: string;
    group: string;
    rgroup: string;
    stat: string;
    time: string;
    elapsed: string;
    nice: string;
    rss: string;
    vsz: string;
    command: string;
  }

  interface DockerVolumeData {
    name: string;
    driver: string;
    labels: any;
    mountpoint: string;
    options: any;
    scope: string;
    created: number;
  }
}

export function dockerInfo(cb?: (data: Dockerstats.DockerInfoData) => any): Promise<Dockerstats.DockerInfoData>;
export function dockerImages(all?: boolean, cb?: (data: Dockerstats.DockerImageData[]) => any): Promise<Dockerstats.DockerImageData[]>;
export function dockerContainers(all?: boolean, cb?: (data: Dockerstats.DockerContainerData[]) => any): Promise<Dockerstats.DockerContainerData[]>;
export function dockerContainerStats(id?: string, cb?: (data: Dockerstats.DockerContainerStatsData[]) => any): Promise<Dockerstats.DockerContainerStatsData[]>;
export function dockerContainerProcesses(id?: string, cb?: (data: any) => any): Promise<Dockerstats.DockerContainerProcessData[]>;
export function dockerVolumes(cb?: (data: Dockerstats.DockerVolumeData[]) => any): Promise<Dockerstats.DockerVolumeData[]>;
export function dockerAll(cb?: (data: any) => any): Promise<any>;
