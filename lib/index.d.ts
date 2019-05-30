// Type definitions for dockerstats
// Project: https://github.com/sebhildebrandt/dockerstats
// Definitions by: sebhildebrandt <https://github.com/sebhildebrandt>

export namespace dockerstats {

  interface DockerInfoData {
    ID: string;
    Containers: number;
    ContainersRunning: number;
    ContainersPaused: number;
    ContainersStopped: number;
    Images: number;
    Driver: string;
    MemoryLimit: boolean;
    SwapLimit: boolean;
    KernelMemory: boolean;
    CpuCfsPeriod: boolean;
    CpuCfsQuota: boolean;
    CPUShares: boolean;
    CPUSet: boolean;
    IPv4Forwarding: boolean;
    BridgeNfIptables: boolean;
    BridgeNfIp6tables: boolean;
    Debug: boolean;
    NFd: number;
    OomKillDisable: boolean;
    NGoroutines: number;
    SystemTime: string;
    LoggingDriver: string;
    CgroupDriver: string;
    NEventsListener: number;
    KernelVersion: string;
    OperatingSystem: string;
    OSType: string;
    Architecture: string;
    NCPU: number;
    MemTotal: number;
    DockerRootDir: string;
    HttpProxy: string;
    HttpsProxy: string;
    NoProxy: string;
    Name: string;
    Labels: string[];
    ExperimentalBuild: boolean;
    ServerVersion: string;
    ClusterStore: string;
    ClusterAdvertise: string;
    DefaultRuntime: string;
    LiveRestoreEnabled: boolean;
    Isolation: string;
    InitBinary: string;
    ProductLicense: string;
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
    mem_usage: number;
    mem_limit: number;
    mem_percent: number;
    cpu_percent: number;
    netIO: {
      rx: number;
      wx: number;
    };
    blockIO: {
      r: number;
      w: number;
    };
    restartCount: number;
    cpu_stats: any;
    precpu_stats: any;
    memory_stats: any,
    networks: any;
  }
}

export function dockerInfo(cb?: (data: Systeminformation.DockerInfoData[]) => any): Promise<Systeminformation.DockerInfoData[]>;
export function dockerContainers(all?: boolean, cb?: (data: Systeminformation.DockerContainerData[]) => any): Promise<Systeminformation.DockerContainerData[]>;
export function dockerContainerStats(id?: string, cb?: (data: Systeminformation.DockerContainerStatsData[]) => any): Promise<Systeminformation.DockerContainerStatsData[]>;
export function dockerContainerProcesses(id?: string, cb?: (data: any) => any): Promise<any>;
export function dockerAll(cb?: (data: any) => any): Promise<any>;

