import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { ItemDetailComponent } from './item-detail.component';

import * as $ from 'jquery';
import 'bootstrap';
import { GridOption } from '../../common/grid-control/grid-control';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { SocketService, ISocketData } from '../../services/socket.service';

@Component({
    selector: 'item-list',
    templateUrl: './item-list.component.html'
})

export class ItemListComponent implements OnInit, DynamicComponent {
    //#region Dynamic Component
    tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
    tabReload: EventEmitter<any> = new EventEmitter();
    //#endregion

    @ViewChild('grid') grid: GridControlComponent;
    gridOption: GridOption;
    dataPack;

    // Subcription
    socketSubcription: any;
    constructor(private router: Router,
        private appServices: AppServices,
        private notifyService: NotifyService,
        private socketService: SocketService) {
    }

    ngOnInit() {
        this.socketSubcription = this.socketService.emitter.subscribe((socketData: ISocketData) => {
            if (socketData.code === "ITEM_CREATE" || socketData.code === "ITEM_UPDATE" || socketData.code === "ITEM_DELETE") {
                this.grid.reload();
            }
        });
        this.gridOption = new GridOption();
        this.gridOption.component = this;
        this.gridOption.key = 'ItemListComponent';
        this.gridOption.url = '/api/Skus/find';
        this.gridOption.customFilter = { 'whseid': this.appServices.account.whseid, 'deleted': false };
        this.gridOption.commands = [{
            icon: 'fa fa-edit text-primary',
            click: this.detail
        }, {
            icon: 'fa fa-trash text-danger',
            click: this.delete
        }];
        this.gridOption.columns = [{
            field: 'storerkey',
            title: 'STORERKEY',
            type: 'string',
            width: '100px'
        }, {
            field: 'sku',
            title: 'SKU',
            type: 'string',
            width: '100px'
        }, {
            field: 'descr',
            title: 'Name',
            type: 'string',
            width: '100px'
        }, {
            field: 'packkey',
            title: 'PACKKEY',
            type: 'string',
            width: '100px'
        }, {
            field: 'stdgrosswgt',
            title: 'STDGROSSWGT',
            type: 'number',
            width: '80px'
        }, {
            field: 'stdnetwgt',
            title: 'STDNETWGT',
            type: 'number',
            width: '80px'
        }, {
            field: 'stdcube',
            title: 'STDCUBE',
            type: 'number',
            width: '80px'
        }, {
            field: 'strategykey',
            title: 'STRATEGYKEY',
            type: 'string',
            width: '100px'
        }, {
            field: 'putawayzone',
            title: 'PUTAWAYZONE',
            type: 'string',
            width: '100px'
        }, {
            field: 'putawaystrategykey',
            title: 'PUTAWAYSTRATEGYKEY',
            type: 'string',
            width: '100px'
        }, {
            field: 'priorityuom',
            title: 'Priority UOM',
            type: 'bool',
            width: '100px',
            trueValue: 'Active',
            falseValue: 'InActive'
        }, {
            field: 'rotatefield',
            title: 'RotateField',
            type: 'string',
            width: '100px'
        }, {
            field: 'rotateby',
            title: 'RotateBy',
            type: 'string',
            width: '100px'
        }, {
            field: 'susr1',
            title: 'Group of Cago ',
            type: 'string',
            width: '100px'
        }, {
            field: 'zonepickcase',
            title: 'ZonePickCase',
            type: 'string',
            width: '100px'
        }, {
            field: 'unitofissue',
            title: 'Unit of Issue',
            type: 'string',
            width: '100px'
        }, {
            field: 'unitofmeasure',
            title: 'Unit of Measure',
            type: 'string',
            width: '100px'
        }, {
            field: 'batch_indicator',
            title: 'Batch Indicator',
            type: 'string',
            width: '100px'
        }, {
            field: 'numerator',
            title: 'Numerator',
            type: 'string',
            width: '100px'
        }, {
            field: 'denominator',
            title: 'Denomination',
            type: 'number',
            width: '100px'
        }, {
            field: 'provisiondays',
            title: 'Provision Day',
            type: 'number',
            width: '100px'
        }, {
            field: 'provisionfield',
            title: 'Provision field',
            type: 'number',
            width: '100px'
        }, {
            field: 'provisionactive',
            title: 'Provision Active',
            type: 'bool',
            width: '100px',
            trueValue: 'Active',
            falseValue: 'InActive'
        }, {
            field: 'shelflife',
            title: 'Shelf Life',
            type: 'string',
            width: ''
        }];
        this.loadPack();
    }
    loadPack() {
        let data = {};
        data['whseid'] = this.appServices.account.whseid;
        data['delete'] = false;
        this.appServices.findPack({ 'filter': JSON.stringify(data) }, this)
            .then((__) => {
                this.dataPack = __.response.json().res;
            }).catch((err) => {
                this.notifyService.error(err.err.json().error.message);
            })
    }

    importExcel(records: any[]) {
        let promises = [];
        records.forEach((record, index) => {
            this.dataPack.forEach(valuepack => {
                let promise = new Promise((resolve, reject) => {
                    if(record.packkey == valuepack.packkey) {
                        record['whseid'] = this.appServices.account.whseid;
                        record['currentuser'] = this.appServices.account.username;
                        record['deleted'] = false;
                        promises.push(new Promise((resolve, reject) => {
                            this.appServices._saveSku({ 'obj': JSON.stringify(record) }, this).then((__) => {
                                resolve();
                            }).catch((err) => {
                                this.notifyService.error(`Error at row: ${index + 1} excel`);
                                resolve();
                            });
                        }));
                    }
                    // else {
                    //     this.notifyService.error(`Error at row ${index + 1} excel: Packkey does not exist`);
                    // }
                });
            });
        });
        Promise.all(promises).then(() => {
            this.socketService.send({
                code: 'ITEM_CREATE',
                data: null
            });
            this.notifyService.success('Process Done');
            this.grid.reload();
        });
    }


    ngOnDestroy() {
        if (this.socketSubcription) this.socketSubcription.unsubscribe();
    }

    detail = (data?: any) => {
        let dynamicTabItem: DynamicTabItem = {
            title: 'Item Detail',
            component: ItemDetailComponent,
            data: data
        }
        this.tabEmitter.emit(dynamicTabItem);
    }

    delete = (data) => {
        this.notifyService.confirmDelete(data.sku).then(() => {
            data['deleted'] = true;
            data['currentuser'] = this.appServices.account.username;
            this.appServices._updateSku({ 'obj': JSON.stringify(data) }, this).then((__) => {
                let res = __.response.json().res;
                this.notifyService.success('Process Done');
                this.socketService.send({
                    code: "ITEM_DELETE",
                    data: null
                });
                this.grid.reload();
            }).catch((err) => {
                this.notifyService.error(err.err.json().error.message);
            })
        });
    }
}
