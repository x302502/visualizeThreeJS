import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { AllocateDetailComponent } from './allocate-detail.component';

import * as $ from 'jquery';
import 'bootstrap';
import { GridOption } from '../../common/grid-control/grid-control';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { SocketService, ISocketData } from '../../services/socket.service';

@Component({
    selector: 'allocate-list',
    templateUrl: './allocate-list.component.html'
})

export class AllocateListComponent implements OnInit, DynamicComponent {
    //#region Dynamic Component
    tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
    tabReload: EventEmitter<any> = new EventEmitter();
    //#endregion

    constructor(private appServices: AppServices,
        private notifyService: NotifyService,
        private socketService: SocketService) {
    }

    ngOnInit() {
        this.listenSocket();
        this.initGrid();
    }

    ngOnDestroy() {
        this.unlistenSocket();
    }

    // Subcription
    socketSubcription: any;
    private listenSocket() {
        this.socketSubcription = this.socketService.emitter.subscribe((socketData: ISocketData) => {
            if (socketData.code === "ALLOCATE_CREATE" || socketData.code === "ALLOCATE_UPDATE" || socketData.code === "ALLOCATE_DELETE") {
                this.grid.reload();
            }
        });
    }

    private unlistenSocket(){
        this.socketSubcription.unsubscribe();
    }

    @ViewChild('grid') grid: GridControlComponent;
    gridOption: GridOption;

    initGrid() {
        this.gridOption = new GridOption();
        this.gridOption.component = this;
        this.gridOption.key = 'AllocateListComponent';
        this.gridOption.url = '/api/Allocatestrategies/find';
        this.gridOption.customFilter = { 'whseid': this.appServices.account.whseid, 'deleted': false };
        this.gridOption.commands = [{
            icon: 'fa fa-edit text-primary',
            click: this.detail
        }, {
            icon: 'fa fa-trash text-danger',
            click: this.delete
        }];
        this.gridOption.columns = [{
            field: 'allocatestrategykey',
            title: 'Code',
            type: 'string',
            width: '150px'
        }, {
            field: 'descr',
            title: 'Description',
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
                record['deleted'] = false;
                this.appServices._insertAllocatestrategy({ 'obj': JSON.stringify(record) }, this).then((__) => {
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
                code: 'ALLOCATE_CREATE',
                data: null
            });
            this.notifyService.success('Process Done');
            this.grid.reload();
        });
    }

    detail = (data?: any) => {
        let dynamicTabItem: DynamicTabItem = {
            title: 'Allocate Detail',
            component: AllocateDetailComponent,
            data: data
        }
        this.tabEmitter.emit(dynamicTabItem);
    }

    delete = (data) => {
        this.notifyService.confirmDelete(data.allocatestrategykey).then(() => {
            data['deleted'] = true;
            data['currentuser'] = this.appServices.account.username;
            this.appServices._updateAllocatestrategy({ 'obj': JSON.stringify(data) }, this).then((__) => {
                this.notifyService.success('Process Done');
                this.socketService.send({
                    code: "ALLOCATE_DELETE",
                    data: null
                });
                this.grid.reload();
            }).catch((err) => {
                this.notifyService.error(err.err.json().error.message);

            });
        });
    }
}
