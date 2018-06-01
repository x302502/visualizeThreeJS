import { IClientConfig } from "../../config.model";

export const icdlb: IClientConfig = {
    host: "http://icdlb-lb.smartlog.info",
    hostAuth: "http://slauth-lb.smartlog.info",
    socket: {
        url: "socket.smartlog.info",
        key: "swm-icdlb"
    },
    image: {
        logo: "../assets/images/logo.svg"
    },
    report:{
        url: "http://smartlog.info:5000",
        template: "KTA"
    }
}