import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { PutawayDetailComponent } from './putaway-detail.component';

import { GridOption } from '../../common/grid-control/grid-control';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { SocketService, ISocketData } from '../../services/socket.service';
import { UtilityService } from '../../services/utility-service/utility.service';

@Component({
    selector: 'putaway-list',
    templateUrl: './putaway-list.component.html'
})

export class PutawayListComponent implements OnInit, DynamicComponent {
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
        private socketService: SocketService,
        private utilityService: UtilityService) {
    }

    ngOnInit() {
        this.socketSubcription = this.socketService.emitter.subscribe((socketData: ISocketData) => {
            if (socketData.code === "PUTAWAY_CREATE" || socketData.code === "PUTAWAY_UPDATE" || socketData.code === "PUTAWAY_DELETE") {
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
        this.gridOption.key = 'PutawayListComponent';
        this.gridOption.url = '/api/Putawaystrategies/find';
        this.gridOption.customFilter = { 'whseid': this.appServices.account.whseid, 'deleted': false };
        // this.gridOption.checkable = true;
        this.gridOption.commands = [{
            icon: 'fa fa-edit text-primary',
            click: this.edit
        }, {
            icon: 'fa fa-trash text-danger',
            click: this.delete
        }];
        this.gridOption.columns = [{
            field: 'putawaystrategykey',
            title: 'Code',
            type: 'string',
            width: '100px'
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
                this.appServices._insertPutawaystrategies({ 'obj': JSON.stringify(record) }, this).then((__) => {
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
                code: 'PUTAWAY_CREATE',
                data: null
            });
            this.notifyService.success('Process Done');
            this.grid.reload();
        });
    }

    create() {
        let dynamicTabItem: DynamicTabItem = {
            title: 'Putaway Detail',
            component: PutawayDetailComponent,
            data: {}
        }
        this.tabEmitter.emit(dynamicTabItem);
    }

    edit = (data) => {
        let dynamicTabItem: DynamicTabItem = {
            title: 'Putaway Detail',
            component: PutawayDetailComponent,
            data: Object.assign({}, data)
        }
        this.tabEmitter.emit(dynamicTabItem);
    }

    delete = (data) => {
        this.notifyService.confirmDelete(data.putawaystrategykey).then(() => {
            data['deleted'] = true;
            data['currentuser'] = this.appServices.account.username;
            this.appServices._updatePutawaystrategies({ 'obj': JSON.stringify(data) }, this).then((__) => {
                this.notifyService.success('Process Done');
                this.socketService.send({
                    code: "PUTAWAY_DELETE",
                    data: null
                });
                this.grid.reload();
            }).catch((err) => {
                this.utilityService.handleError(err);
            });
        });
    }
}
