import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { CustomerDetailComponent } from './customer-detail.component';

import * as $ from 'jquery';
import 'bootstrap';
import { GridOption } from '../../common/grid-control/grid-control';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { SocketService, ISocketData } from '../../services/socket.service';
import { LoadingService } from '../../services/loading-service/loading.service';

@Component({
    selector: 'customer-list',
    templateUrl: './customer-list.component.html'
})

export class CustomerListComponent implements OnInit, DynamicComponent {
    //#region Dynamic Component
    tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
    tabReload: EventEmitter<any> = new EventEmitter();
    //#endregion

    @ViewChild('grid') grid: GridControlComponent;
    gridOption: GridOption;

    // Subcription
    socketSubcription: any;
    constructor(private router: Router,
        private appServices: AppServices,
        private notifyService: NotifyService,
        private socketService: SocketService,
        private loadingService: LoadingService) {
    }

    ngOnInit() {
        this.socketSubcription = this.socketService.emitter.subscribe((socketData: ISocketData) => {
            if (socketData.code === "CUSTOMER_CREATE" || socketData.code === "CUSTOMER_UPDATE" || socketData.code === "CUSTOMER_DELETE") {
                this.grid.reload();
            }
        });
        this.initGrid();
    }

    ngOnDestroy() {
        this.socketSubcription.unsubscribe()
    }

    initGrid() {
        this.gridOption = new GridOption();
        this.gridOption.component = this;
        this.gridOption.key = 'CustomerListComponent';
        this.gridOption.url = '/api/Storers/find ';
        this.gridOption.customFilter = { 'whseid': this.appServices.account.whseid, 'type': '2', 'deleted': false };
        this.gridOption.commands = [{
            icon: 'fa fa-edit text-primary',
            click: this.edit
        }, {
            icon: 'fa fa-trash text-danger',
            click: this.delete
        }];
        this.gridOption.columns = [{
            field: 'storerkey',
            title: 'CODE',
            type: 'string',
            width: '100px'
        }, {
            field: 'company',
            title: 'NAME',
            type: 'string',
            width: '350px'
        }, {
            field: 'groupcode',
            title: 'GROUP',
            type: 'string',
            width: '100px'
        }, {
            field: 'address1',
            title: 'ADDRESS',
            type: 'string',
            width: ''
        }];
    }

    importExcel(records: any[]) {
        let promises = [];
        records.forEach((record, index) => {
            let promise = new Promise((resolve, reject) => {
                record['whseid'] = this.appServices.account.whseid;
                record['currentuser'] = this.appServices.account.username;
                record['type'] = '2';
                this.appServices._saveStorer({ 'obj': JSON.stringify(record) }, this).then((__) => {
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
                code: 'CUSTOMER_CREATE',
                data: null
            });
            this.notifyService.success('Process Done');
            this.grid.reload();
        });
    }

    create() {
        let dynamicTabItem: DynamicTabItem = {
            title: 'Customer Detail',
            component: CustomerDetailComponent,
            data: {}
        }
        this.tabEmitter.emit(dynamicTabItem);
    }

    edit = (data) => {
        let dynamicTabItem: DynamicTabItem = {
            title: 'Customer Detail',
            component: CustomerDetailComponent,
            data: Object.assign({}, data)
        }
        this.tabEmitter.emit(dynamicTabItem);
    }

    delete = (data) => {
        this.notifyService.confirmDelete(data.storerkey).then(() => {
            data['deleted'] = true;
            data['currentuser'] = this.appServices.account.username;
            this.appServices._updateStorer({ 'obj': JSON.stringify(data) }, this).then((__) => {
                this.notifyService.success('Process Done');
                this.socketService.send({
                    code: "CUSTOMER_DELETE",
                    data: null
                });
                this.grid.reload();
            }).catch((err) => {
                this.notifyService.error(err.err.json().error.message);
            });
        });
    }
}
