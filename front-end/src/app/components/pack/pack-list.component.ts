import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { PasteService } from './../../paste.service';
import { DatePipe } from '@angular/common';
import { ModalService } from '../../common/modal.service';
import { ModalComponent } from '../../common/modal.component';
import { CompleterService, CompleterData } from 'ng2-completer';
import { PopupAllocateStrategyComponent } from '../../common/popup-allocate-strategy/popup-allocate-strategy.component';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { PackDetailComponent } from './pack-detail.component';

import * as $ from 'jquery';
import 'bootstrap';
import { GridOption } from '../../common/grid-control/grid-control';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { SocketService, ISocketData } from '../../services/socket.service';
import { UtilityService } from '../../services/utility-service/utility.service';

@Component({
    selector: 'pack-list',
    templateUrl: './pack-list.component.html'
})

export class PackListComponent implements OnInit, DynamicComponent {
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
        private pasteService: PasteService,
        private completerService: CompleterService,
        private socketService:SocketService,
        private utilityService: UtilityService) {
    }

    ngOnInit() {
        this.socketSubcription = this.socketService.emitter.subscribe((socketData:ISocketData)=>{
            if(socketData.code === "PACK_CREATE" || socketData.code === "PACK_UPDATE" || socketData.code === "PACK_DELETE"){
                this.grid.reload();
            }
        });
        this.initGrid();
    }

    ngOnDestroy(){
        this.socketSubcription.unsubscribe()
    }

    initGrid(){
        this.gridOption = new GridOption();
        this.gridOption.component = this;
        this.gridOption.key = 'PackListComponent';
        this.gridOption.url = '/api/Packs/find';
        this.gridOption.customFilter = { 'whseid': this.appServices.account.whseid, 'deleted': false };
        // this.gridOption.checkable = true;
        this.gridOption.commands = [{
            icon: 'fa fa-edit text-primary',
            click: this.edit
        },{
            icon: 'fa fa-trash text-danger',
            click: this.delete
        }];
        this.gridOption.columns = [{
            field: 'packkey',
            title: 'PACKKEY',
            type: 'string',
            width: '100px'
        },{
            field: 'packdescr',
            title: 'PACKDESCR',
            type: 'string',
            width: '100px'
        },{
            field: 'qty',
            title: 'QUANTITY',
            type: 'string',
            width: '100px'
        },{
            field: 'packuom3',
            title: 'MASTER UNIT',
            type: 'string',
            width: '100px'
        },{
            field: 'iswhqty2',
            title: 'MASTER UINT ISDEFAULT',
            type: 'bool',
            width: '60px',
            trueValue: 'Default',
            falseValue: 'Not Default'
        },{
            field: 'innerpack',
            title: 'QTY IN CASE',
            type: 'string',
            width: '100px'
        },{
            field: 'packuom2',
            title: 'CASE UNIT',
            type: 'string',
            width: '100px'
        },{
            field: 'iswhqty3',
            title: 'CASE UNIT ISDEFAULT',
            type: 'bool',
            width: '60px',
            trueValue: 'Default',
            falseValue: 'Not Default'
        },{
            field: 'pallet',
            title: 'QTY IN PALLET',
            type: 'string',
            width: '100px'
        },{
            field: 'packuom4',
            title: 'PALLET UNIT',
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
                this.appServices._savePack({ 'obj': JSON.stringify(record) }, this).then((__) => {
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
                code: 'PACK_CREATE',
                data: null
            });
            this.notifyService.success('Process Done');
            this.grid.reload();
        });
    }


    create() {
        let dynamicTabItem: DynamicTabItem = {
            title: 'Pack Detail',
            component: PackDetailComponent,
            data: {}
        }
        this.tabEmitter.emit(dynamicTabItem);
    }

    edit = (data) => {
        let dynamicTabItem: DynamicTabItem = {
            title: 'Pack Detail',
            component: PackDetailComponent,
            data: Object.assign({}, data)
        }
        this.tabEmitter.emit(dynamicTabItem);
    }

    delete = (data) => {
        this.notifyService.confirm(`Do you want to delete <strong class="text-warning">${data.packkey}</strong>`).then(() => {
            data['deleted'] = true;
            data['currentuser'] = this.appServices.account.username;
            this.appServices._updatePack({ 'obj': JSON.stringify(data) }, this).then((__) => {
                let res = __.response.json().res;
                this.notifyService.success('Process Done');
                this.socketService.send({
                    code: "pack_DELETE",
                    data: null
                });
                this.grid.reload();
            }).catch((err) => {
                this.utilityService.handleError(err);
            })
        });
    }


}
