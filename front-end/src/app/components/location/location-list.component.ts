import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { LocationDetailComponent } from './location-detail.component';

import { GridOption } from '../../common/grid-control/grid-control';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { SocketService, ISocketData } from '../../services/socket.service';

@Component({
    selector: 'location-list',
    templateUrl: './location-list.component.html'
})

export class LocationListComponent implements OnInit, DynamicComponent {
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
            if (socketData.code === "LOCATION_CREATE" || socketData.code === "LOCATION_UPDATE" || socketData.code === "LOCATION_DELETE") {
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
        this.gridOption.key = 'LocationListComponent';
        this.gridOption.url = '/api/Locs/find';
        this.gridOption.customFilter = { 'whseid': this.appServices.account.whseid, 'deleted': false };
        // this.gridOption.checkable = true;
        this.gridOption.commands = [{
            icon: 'fa fa-edit text-primary',
            click: this.detail
        }, {
            icon: 'fa fa-trash text-danger',
            click: this.delete
        }];
        this.gridOption.columns = [{
            field: 'loc',
            title: 'LOCATION',
            type: 'string'
        }, {
            field: 'status',
            title: 'STATUS',
            type: 'string',
            width: '100px'
        }, {
            field: 'putawayzone',
            title: 'PUTAWAYZONE',
            type: 'string',
            width: '100px'
        }, {
            field: 'stacklimit',
            title: 'STACKLIMIT',
            type: 'string',
            width: '100px'
        }, {
            field: 'logicallocation',
            title: 'LOGICAL LOCATION',
            type: 'string',
            width: '100px'
        }, {
            field: 'comminglesku',
            title: 'COMMINGLESKU',
            type: 'bool',
            width: '80px',
            trueValue: 'Active',
            falseValue: 'InActive'
        }, {
            field: 'comminglelot',
            title: 'COMMINGLELOT',
            type: 'bool',
            width: '80px',
            trueValue: 'Active',
            falseValue: 'InActive'
        }];
    }

    importExcel(records: any[]) {
        let promises = [];
        records.forEach((record, index) => {
            let promise = new Promise((resolve, reject) => {
                record['whseid'] = this.appServices.account.whseid;
                record['currentuser'] = this.appServices.account.username;
                this.appServices._saveLocation({ 'obj': JSON.stringify(record) }, this).then((__) => {
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
                code: 'LOCATION_CREATE',
                data: null
            });
            this.notifyService.success('Process Done');
            this.grid.reload();
        });
    }

    detail = (data?: any) => {
        let dynamicTabItem: DynamicTabItem = {
            title: 'Location Detail',
            component: LocationDetailComponent,
            data: data
        }
        this.tabEmitter.emit(dynamicTabItem);
    }

    delete = (data) => {
        this.notifyService.confirm(`Do you want to delete <strong class="text-warning">${data.loc}</strong>`).then(() => {
            data['deleted'] = true;
            data['currentuser'] = this.appServices.account.username;
            this.appServices._updateLocation({ 'obj': JSON.stringify(data) }, this).then((__) => {
                let res = __.response.json().res;
                this.notifyService.success('Process Done');
                this.socketService.send({
                    code: "LOCATION_DELETE",
                    data: null
                });
                this.grid.reload();
            }).catch((err) => {
                this.notifyService.error(err.err.json().error.message);
            })
        });
    }
}
