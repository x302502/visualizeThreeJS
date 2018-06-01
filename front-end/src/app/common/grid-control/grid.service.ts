import { Injectable } from '@angular/core';
import { IGridColumnConfig } from './grid-control';

@Injectable()
export class GridService {

    set(key: string, value: IGridColumnConfig[]) {
        let data = JSON.stringify(value);
        localStorage.setItem(key, data);
    }

    get(key: string): IGridColumnConfig[] {
        let data = localStorage.getItem(key);
        return JSON.parse(data);
    }

    check(key) {
        return localStorage.getItem(key) ? true : false;
    }
}