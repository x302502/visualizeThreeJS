import { IClientConfig } from "../../config.model";

export const localhost: IClientConfig = {
    host: "http://localhost:3000",
    hostAuth: "http://slauth-lb.gogoviet.com",
    socket: {
        url: "socket.smartlog.info",
        key: "swm-localhost"
    },
    image: {
        logo: "../assets/images/logo.svg"
    },
    report:{
        url: "http://localhost:21000",
        template: "KTA"
    }
}