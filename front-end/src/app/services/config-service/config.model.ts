export interface IClientConfig {
    host: string;
    hostAuth: string;
    socket: {
        url: string,
        key: string
    },
    image: {
        logo: string;
    },
    report: {
        url: string;
        template: string;
    }
}

export interface IHostConfig {
    "localhost": IClientConfig;
    "swm.gogoviet.com": IClientConfig;
    "kta.smartlog.info": IClientConfig;
    "swm.smartlog.info": IClientConfig;
    "tbs.smartlog.info": IClientConfig;
    "icdlb.smartlog.info": IClientConfig;
    "ktg.smartlog.info": IClientConfig;
}