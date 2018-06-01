import { IClientConfig } from "../../config.model";

export const tbs: IClientConfig = {
    host: "http://tbs-lb.smartlog.info",
    hostAuth: "http://slauth-lb.smartlog.info",
    socket: {
        url: "socket.smartlog.info",
        key: "swm-tbs"
    },
    image: {
        logo: "../assets/images/logo.svg"
    },
    report:{
        url: "http://smartlog.info:5000",
        template: "KTA"
    }
}