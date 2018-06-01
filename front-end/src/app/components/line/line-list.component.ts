import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { LineDetailComponent } from './line-detail.component';

import { GridOption } from '../../common/grid-control/grid-control';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { SocketService, ISocketData } from '../../services/socket.service';

@Component({
  selector: 'line-list',
  templateUrl: './line-list.component.html',
})
export class LineListComponent implements OnInit, DynamicComponent {
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
      if (socketData.code === "LINE_CREATE" || socketData.code === "LINE_UPDATE" || socketData.code === "LINE_DELETE") {
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
    this.gridOption.key = 'LineListComponent';
    this.gridOption.url = '/api/Lines/find';
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
      field: 'line',
      title: 'Code',
      type: 'string',
      width: ''
    }, {
      field: 'maxpallet',
      title: 'Max Pallets',
      type: 'number',
      width: ''
    }, {
      field: 'maxcarton',
      title: 'Max Case',
      type: 'number',
      width: ''
    }];
  }

  importExcel(records: any[]) {
    let promises = [];
    records.forEach((record, index) => {
        let promise = new Promise((resolve, reject) => {
            record['whseid'] = this.appServices.account.whseid;
            record['currentuser'] = this.appServices.account.username;
            this.appServices._saveLine({ 'obj': JSON.stringify(record) }, this).then((__) => {
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
            code: 'LINE_CREATE',
            data: null
        });
        this.notifyService.success('Process Done');
        this.grid.reload();
    });
}

  detail = (data?: any) => {
    let dynamicTabItem: DynamicTabItem = {
      title: 'Line Detail',
      component: LineDetailComponent,
      data: data
    }
    this.tabEmitter.emit(dynamicTabItem);
  }

  delete = (data) => {
    this.notifyService.confirmDelete(data.line).then(() => {
      data['deleted'] = true;
      data['currentuser'] = this.appServices.account.username;
      this.appServices._updateLine({ 'obj': JSON.stringify(data) }, this).then((__) => {
        this.notifyService.success('Process Done');
        this.socketService.send({
          code: "LINE_DELETE",
          data: null
        });
        this.grid.reload();
      }).catch((err) => {
        this.notifyService.error(err.err.json().error.message);
      })
    });
  }
}
