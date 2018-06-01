import { Injectable, EventEmitter } from '@angular/core';
import * as uuid from 'uuid';
import * as $ from 'jquery';

import { host } from './configurations/app.config';
import { IClientConfig } from './config.model';

@Injectable()
export class ConfigService {
    clientConfig: IClientConfig;
    constructor() {
        Object.keys(host).forEach(key => {
            if (location.host.toLowerCase().indexOf(key) !== -1) {
                this.clientConfig = host[key];
            }
        });
    }
}