import { IClientConfig } from "../../config.model";

export const swm: IClientConfig = {
    host: "http://swm-lb.smartlog.info",
    hostAuth: "http://slauth-lb.smartlog.info",
    socket: {
        url: "socket.smartlog.info",
        key: "swm-demo"
    },
    image: {
        logo: "../assets/images/logo.svg"
    },
    report:{
        url: "http://smartlog.info:5000",
        template: "KTA"
    }
}