import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DatePipe } from '@angular/common';
import * as $ from 'jquery';
import 'bootstrap';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { GridOption } from '../../common/grid-control/grid-control';
import { DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { SystemCodeDetailComponent } from './system-code-detail.component';
import { SocketService, ISocketData } from '../../services/socket.service';
import { UtilityService } from '../../services/utility-service/utility.service';
@Component({
  selector: 'app-system-code-list',
  templateUrl: './system-code-list.component.html'
})
export class SystemCodeListComponent implements OnInit {

  //#region Dynamic Component
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  //#endregion

  @ViewChild('grid') grid: GridControlComponent;
  gridOption: GridOption;
  socketSubcription: any;
  constructor(private router: Router,
    private appServices: AppServices,
    private notifyService: NotifyService,
    private utilityService: UtilityService,
    private socketService: SocketService) {
  }
  ngOnInit() {
    this.listenSocket();
    this.initGrid();
  }

  ngOnDestroy() {
    if (this.socketSubcription) this.socketSubcription.unsubscribe();
  }

  listenSocket() {
    this.socketSubcription = this.socketService.emitter.subscribe((socketData: ISocketData) => {
      if (socketData.code === "SYSTEMCODE_CREATE" || socketData.code === "SYSTEMCODE_UPDATE" || socketData.code === "SYSTEMCODE_DELETE") {
        this.grid.reload();
      }
    });
  }

  initGrid() {
    this.gridOption = new GridOption();
    this.gridOption.component = this;
    this.gridOption.key = 'SystemCodeListComponent';
    this.gridOption.url = '/api/Codelists/find';
    this.gridOption.customFilter = { 'whseid': this.appServices.account.whseid, 'deleted': false };
    this.gridOption.commands = [{
      icon: 'fa fa-edit text-primary',
      click: this.detail
    }, {
      icon: 'fa fa-trash text-danger',
      click: this.delete
    }];
    this.gridOption.columns = [{
      field: 'listname',
      title: 'List Name',
      type: 'string',
      width: '200px'
    }, {
      field: 'description',
      title: 'Description',
      type: 'string'
    }];
  }

  importExcel(records: any[]) {
    let promises = [];
    records.forEach((record, index) => {
      let promise = new Promise((resolve, reject) => {
        record['whseid'] = this.appServices.account.whseid;
        record['currentuser'] = this.appServices.account.username;
        record['deleted'] = false;
        this.appServices._insertCodelist({ 'obj': JSON.stringify(record) }, this).then((__) => {
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
        code: 'SYSTEMCODE_CREATE',
        data: null
      });
      this.notifyService.success('Process Done');
      this.grid.reload();
    });
  }

  detail = (data?: any) => {
    let dynamicTabItem: DynamicTabItem = {
      title: 'System Code Detail',
      component: SystemCodeDetailComponent,
      data: data
    }
    this.tabEmitter.emit(dynamicTabItem);
  }
  delete = (data) => {
    this.notifyService.confirmDelete(data.sku).then(() => {
      data['deleted'] = true;
      data['currentuser'] = this.appServices.account.username;
      this.appServices._updateCodelist({ 'obj': JSON.stringify(data) }, this).then(obj => {
        this.notifyService.success('Process Done');
        this.grid.reload();
        this.socketService.send({
          code: 'SYSTEMCODE_DELETE',
          data: data
        });
      }).catch(err => {
        this.utilityService.handleError(err);
      });
    });
  }
}
