import { IClientConfig } from "../../config.model";

export const ktg: IClientConfig = {
    host: "http://ktg-lb.smartlog.info",
    hostAuth: "http://slauth-lb.smartlog.info",
    socket: {
        url: "socket.smartlog.info",
        key: "swm-ktg"
    },
    image: {
        logo: "../assets/images/logo.svg"
    },
    report:{
        url: "http://smartlog.info:5000",
        template: "KTA"
    }
}