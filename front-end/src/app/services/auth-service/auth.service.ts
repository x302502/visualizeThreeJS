import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { ConfigService } from '../config-service/config.service';
import { NotifyService } from '../../notify.service';
import { User } from './auth.model';
import { Router } from '@angular/router';
import { SocketService, ISocketData } from '../socket.service';
import { AUTH_API } from './auth.resource';

@Injectable()
export class AuthService {
    host: string;
    user: User = null;
    constructor(private http: Http,
        private router: Router,
        private notifyService: NotifyService,
        private configService: ConfigService,
        private socketService: SocketService) {
        this.host = configService.clientConfig.hostAuth;

        this.socketService.emitter.subscribe((socketData: ISocketData) => {
            if (socketData.code === "USER_LOGIN" && socketData.data.username === this.user.username && socketData.data.token !== this.user.token) {
                this.notifyService.warning("YOUR ACCOUNT WAS LOGGED ON OTHER COMPUTER");
                this.logout();
            }
        });
    }

    login(username, password) {
        return new Promise((resolve, reject) => {
            this.http.post(this.host + AUTH_API.USER.SIGNIN, {
                obj: JSON.stringify({ username, password })
            }).toPromise().then(response => {
                let data1 = response.json().res;
                this.http.post(this.host + AUTH_API.USER.AFTERSIGNIN, {
                    obj: JSON.stringify({
                        token: data1.token.id,
                        username: data1.user.username,
                        appcode: 'wms',
                        type: data1.user.type
                    })
                }).toPromise().then(response => {
                    let data2 = response.json().res;
                    if (!data2.owner || data2.owner.length === 0) {
                        throw 'NO_OWNER';
                    } else if (!data2.warehouse || data2.warehouse.length === 0) {
                        throw 'NO_WAREHOUSE';
                    } else {
                        this.user = {
                            token: data1.token.id,
                            parentuser: data1.user.parentuser,
                            username: data1.user.username,
                            fullname: data1.user.fullname,
                            email: data1.user.email,
                            tel: data1.user.tel,
                            type: data1.user.type,
                            owners: data2.owner,
                            strOwners: data2.owner.map(owner => `'${owner.storerkey}'`).join(),
                            warehouses: data2.warehouse,
                            whseid: data2.warehouse[0].warehousecode,
                            warehousename: data2.warehouse[0].warehousename
                        };
                        localStorage.setItem(location.origin, JSON.stringify(this.user));
                        this.socketService.send({
                            code: "USER_LOGIN",
                            data: {
                                username: this.user.username,
                                token: this.user.token
                            }
                        });
                        resolve();
                    }
                }).catch(err => {
                    reject(err);
                });
            }).catch(err => {
                reject(err);
            });
        });
    }

    logout() {
        this.user = null;
        window.localStorage.getItem(document.location.origin);
        this.router.navigate(['login']);
    }

    checkToken(): Promise<boolean> {
        if (localStorage.getItem(document.location.origin)) {
            return new Promise((resolve, reject) => {
                this.user = JSON.parse(localStorage.getItem(location.origin));
                this.http.post(this.host + AUTH_API.USER.CHECK_TOKEN, { token: this.user.token || 'NONE' }).toPromise().then(() => {
                    resolve(true);
                }).catch(err => {
                    reject(err);
                });
            })
        } else {
            return Promise.reject('TOKEN_REQUIRED');
        }
    }

    changeWarehouse({ warehousecode, warehousename }) {
        return new Promise((resolve, reject) => {
            this.http.post(this.host + AUTH_API.WAREHOUSE.CHANGE, {
                obj: JSON.stringify({
                    token: this.user.token,
                    type: this.user.type,
                    warehousecode: warehousecode,
                    username: this.user.username,
                    appcode: 'wms'
                })
            }).toPromise().then(response => {
                this.user.owners = response.json().res.owner;
                this.user.strOwners = this.user.owners.map(e => `'${e.storerkey}'`).join();
                this.user.whseid = warehousecode;
                this.user.warehousename = warehousename;
                localStorage.setItem(location.origin, JSON.stringify(this.user));
                resolve();
            }).catch(err => {
                reject(err);
            });
        });
    }
}