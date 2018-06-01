import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { DatePipe } from '@angular/common';
import { CompleterService, CompleterData } from 'ng2-completer';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { CarrierDetailComponent } from './carrier-detail.component';
import * as $ from 'jquery';
import 'bootstrap';
import { GridOption } from '../../common/grid-control/grid-control';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { SocketService, ISocketData } from '../../services/socket.service';

@Component({
    selector: 'carrier-list',
    templateUrl: './carrier-list.component.html',
})
export class CarrierListComponent implements OnInit, DynamicComponent {
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
        private completerService: CompleterService,
        private socketService: SocketService) {
    }

    ngOnInit() {
        this.socketSubcription = this.socketService.emitter.subscribe((socketData: ISocketData) => {
            if (socketData.code === "CARRIER_CREATE" || socketData.code === "CARRIER_UPDATE" || socketData.code === "CARRIER_DELETE") {
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
        this.gridOption.key = 'CarrierListComponent';
        this.gridOption.url = '/api/Storers/find';
        this.gridOption.customFilter = { 'whseid': this.appServices.account.whseid, 'type': '3', 'deleted': false };
        this.gridOption.commands = [{
            icon: 'fa fa-edit text-primary',
            click: this.edit
        }, {
            icon: 'fa fa-trash text-danger',
            click: this.delete
        }];
        this.gridOption.columns = [{
            field: 'storerkey',
            title: 'Code',
            type: 'string',
            width: '150px'
        }, {
            field: 'company',
            title: 'Company',
            type: 'string'
        }];
    }

    importExcel(records: any[]) {
        let promises = [];
        records.forEach((record, index) => {
            console.log(record);
            let promise = new Promise((resolve, reject) => {
                record['whseid'] = this.appServices.account.whseid;
                record['currentuser'] = this.appServices.account.username;
                record['deleted'] = false;
                record['type'] = "3";
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
                code: 'CARRIER_CREATE',
                data: null
            });
            this.notifyService.success('Process Done');
            this.grid.reload();
        });
    }

    create() {
        let dynamicTabItem: DynamicTabItem = {
            title: 'Carrier Detail',
            component: CarrierDetailComponent,
            data: {}
        }
        this.tabEmitter.emit(dynamicTabItem);
    }

    edit = (data) => {
        let dynamicTabItem: DynamicTabItem = {
            title: 'Carrier Detail',
            component: CarrierDetailComponent,
            data: Object.assign({}, data)
        }
        this.tabEmitter.emit(dynamicTabItem);
    }

    delete = (data) => {
        this.notifyService.confirm(`Do you want to delete <strong class="text-warning">${data.storerkey}</strong>`).then(() => {
            data['deleted'] = true;
            data['currentuser'] = this.appServices.account.username;
            this.appServices._updateStorer({ 'obj': JSON.stringify(data) }, this).then((__) => {
                this.notifyService.success('Process Done');
                this.socketService.send({
                    code: "CARRIER_DELETE",
                    data: null
                });
                this.grid.reload();
            }).catch((err) => {
                this.notifyService.error(err.err.json().error.message);
            })
        });
    }
}
