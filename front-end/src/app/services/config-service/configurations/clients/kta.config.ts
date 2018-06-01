import { IClientConfig } from "../../config.model";

export const kta: IClientConfig = {
    host: "http://kta-lb.smartlog.info",
    hostAuth: "http://slauth-lb.smartlog.info",
    socket: {
        url: "socket.smartlog.info",
        key: "swm-kta"
    },
    image: {
        logo: "../assets/images/logo-kta.svg"
    },
    report:{
        url: "http://smartlog.info:5000",
        template: "KTA"
    }
}