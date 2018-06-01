import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import * as $ from 'jquery';
import 'bootstrap';

import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { ZoneDetailComponent } from './zone-detail.component';

import { GridOption } from '../../common/grid-control/grid-control';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { SocketService, ISocketData } from '../../services/socket.service';
import { UtilityService } from '../../services/utility-service/utility.service';

@Component({
    selector: 'zone-list',
    templateUrl: './zone-list.component.html'
})

export class ZoneListComponent implements OnInit, DynamicComponent {
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
        private socketService:SocketService,
        private utilityService: UtilityService) {
    }

    ngOnInit() {
        this.socketSubcription = this.socketService.emitter.subscribe((socketData:ISocketData)=>{
            if(socketData.code === "ZONE_CREATE" || socketData.code === "ZONE_UPDATE" || socketData.code === "ZONE_DELETE"){
                this.grid.reload();
            }
        });
        this.initGrid();
    }

    ngOnDestroy(){
        this.socketSubcription.unsubscribe()
    }

    private initGrid(){
        this.gridOption = new GridOption();
        this.gridOption.component = this;
        this.gridOption.key = 'ZoneListComponent';
        this.gridOption.url = '/api/Putawayzones/find';
        this.gridOption.customFilter = { 'whseid': this.appServices.account.whseid, 'deleted': false };
        this.gridOption.commands = [{
            icon: 'fa fa-edit text-primary',
            click: this.edit
        },{
            icon: 'fa fa-trash text-danger',
            click: this.delete
        }];
        this.gridOption.columns = [{
            field: 'putawayzone',
            title: 'PutawayZone',
            type: 'string',
            width: '100px'
        },{
            field: 'descr',
            title: 'Descr',
            type: 'string'
        },{
            field: 'setdefault',
            title: 'isDefault',
            type: 'bool',
            width: '100px',
            trueValue: 'Default',
            falseValue: 'Not Default'
        }];
    }

    importExcel(records: any[]) {
        let promises = [];
        records.forEach((record, index) => {
            let promise = new Promise((resolve, reject) => {
                record['whseid'] = this.appServices.account.whseid;
                record['currentuser'] = this.appServices.account.username;
                this.appServices._saveZone({ 'obj': JSON.stringify(record) }, this).then((__) => {
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
                code: 'ZONE_CREATE',
                data: null
            });
            this.notifyService.success('Process Done');
            this.grid.reload();
        });
    }

    create() {
        let dynamicTabItem: DynamicTabItem = {
            title: 'Zone Detail',
            component: ZoneDetailComponent,
            data: {}
        }
        this.tabEmitter.emit(dynamicTabItem);
    }

    edit = (zone) => {
        let dynamicTabItem: DynamicTabItem = {
            title: 'Zone Detail',
            component: ZoneDetailComponent,
            data: Object.assign({}, zone)
        }
        this.tabEmitter.emit(dynamicTabItem);
    }

    delete = (zone) => {
        this.notifyService.confirmDelete(zone.putawayzone).then(() => {
            zone['deleted'] = true;
            zone['currentuser'] = this.appServices.account.username;
            this.appServices._updateZone({ 'obj': JSON.stringify(zone) }, this).then((__) => {
                let res = __.response.json().res;
                this.notifyService.success('Process Done');
                this.socketService.send({
                    code: "ZONE_DELETE",
                    data: zone
                });
                this.grid.reload();
            }).catch(err => {
                this.utilityService.handleError(err);
            })
        });
    }
}
