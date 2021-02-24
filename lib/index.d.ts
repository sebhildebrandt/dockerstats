// Type definitions for dockerstats
// Project: https://github.com/sebhildebrandt/dockerstats
// Definitions by: sebhildebrandt <https://github.com/sebhildebrandt>

export namespace dockerstats {

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
    mfd: number;
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
    memoryStats: any,
    networks: any;
  }
}

export function dockerInfo(cb?: (data: dockerstats.DockerInfoData[]) => any): Promise<dockerstats.DockerInfoData[]>;
export function dockerImages(all?: boolean, cb?: (data: dockerstats.DockerImageData[]) => any): Promise<dockerstats.DockerImageData[]>;
export function dockerContainers(all?: boolean, cb?: (data: dockerstats.DockerContainerData[]) => any): Promise<dockerstats.DockerContainerData[]>;
export function dockerContainerStats(id?: string, cb?: (data: dockerstats.DockerContainerStatsData[]) => any): Promise<dockerstats.DockerContainerStatsData[]>;
export function dockerContainerProcesses(id?: string, cb?: (data: any) => any): Promise<any>;
export function dockerAll(cb?: (data: any) => any): Promise<any>;

