import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { CustomergroupDetailComponent } from './customergroup-detail.component';

import * as $ from 'jquery';
import 'bootstrap';
import { GridOption } from '../../common/grid-control/grid-control';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { SocketService, ISocketData } from '../../services/socket.service';

@Component({
    selector: 'customergroup-list',
    templateUrl: './customergroup-list.component.html'
})

export class CustomergroupListComponent implements OnInit, DynamicComponent {
    //#region Dynamic Component
    tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
    tabReload: EventEmitter<any> = new EventEmitter();
    //#endregion

    @ViewChild('grid') grid: GridControlComponent;
    gridOption: GridOption;

    // Subcription
    socketSubcription: any;
    constructor(private appServices: AppServices,
        private notifyService: NotifyService,
        private socketService: SocketService) {
    }

    ngOnInit() {
        this.socketSubcription = this.socketService.emitter.subscribe((socketData: ISocketData) => {
            if (socketData.code === "CUSTOMERGROUP_CREATE" || socketData.code === "CUSTOMERGROUP_UPDATE" || socketData.code === "CUSTOMERGROUP_DELETE") {
                this.grid.reload();
            }
        });
        this.initGrid();
    }

    ngOnDestroy() {
        this.socketSubcription.unsubscribe();
    }

    initGrid() {
        this.gridOption = new GridOption();
        this.gridOption.component = this;
        this.gridOption.key = 'CustomergroupListComponent';
        this.gridOption.url = '/api/Customergroups/find';
        this.gridOption.customFilter = { 'whseid': this.appServices.account.whseid, 'deleted': false };
        this.gridOption.commands = [{
            icon: 'fa fa-edit text-primary',
            click: this.edit
        }, {
            icon: 'fa fa-trash text-danger',
            click: this.delete
        }];
        this.gridOption.columns = [{
            field: 'groupcode',
            title: 'CODE',
            type: 'string',
            width: '100px'
        }, {
            field: 'groupname',
            title: 'NAME',
            type: 'string'
        }, {
            field: 'shelflife',
            title: 'SHELFLIFE(%)',
            type: 'string',
            width: '100px'
        }];
    }

    importExcel(records: any[]) {
        let promises = [];
        records.forEach((record, index) => {
            let promise = new Promise((resolve, reject) => {
                record['whseid'] = this.appServices.account.whseid;
                record['currentuser'] = this.appServices.account.username;
                this.appServices._saveCustomergroup({ 'obj': JSON.stringify(record) }, this).then((__) => {
                    resolve();
                }).catch((err) => {
                    this.notifyService.error('Error at: ' + (index + 1));
                    resolve();
                });
            });
            promises.push(promise);
        });
        Promise.all(promises).then(() => {
            this.socketService.send({
                code: 'CUSTOMERGROUP_CREATE',
                data: null
            });
            this.notifyService.success('Process Done');
            this.grid.reload();
        });
    }


    create() {
        let dynamicTabItem: DynamicTabItem = {
            title: 'Customer Group Detail',
            component: CustomergroupDetailComponent,
            data: {}
        }
        this.tabEmitter.emit(dynamicTabItem);
    }

    edit = (data) => {
        let dynamicTabItem: DynamicTabItem = {
            title: 'Customergroup Detail',
            component: CustomergroupDetailComponent,
            data: Object.assign({}, data)
        }
        this.tabEmitter.emit(dynamicTabItem);
    }

    delete = (data) => {
        this.notifyService.confirmDelete(data.groupcode).then(() => {
            data['deleted'] = true;
            data['currentuser'] = this.appServices.account.username;
            this.appServices._updateCustomergroup({ 'obj': JSON.stringify(data) }, this).then((__) => {
                let res = __.response.json().res;
                this.notifyService.success('Process Done');
                this.socketService.send({
                    code: "CUSTOMERGROUP_DELETE",
                    data: null
                });
                this.grid.reload();
            }).catch((err) => {
                this.notifyService.error(err.err.json().error.message);
            })
        });
    }
}
