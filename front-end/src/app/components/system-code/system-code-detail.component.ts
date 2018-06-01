import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { PasteService } from './../../paste.service';
import { DatePipe } from '@angular/common';
import { ModalService } from '../../common/modal.service';
import { ModalComponent } from '../../common/modal.component';
import { CompleterService, CompleterData } from 'ng2-completer';
import { PopupLocationComponent } from '../../common/popup-location/popup-location.component';
import { PopupZoneComponent } from '../../common/popup-zone/popup-zone.component';
import { PopupAllocateStrategyComponent } from '../../common/popup-allocate-strategy/popup-allocate-strategy.component';
import { PopupPackComponent } from '../../common/popup-pack/popup-pack.component';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';

import * as jQuery from 'jquery';
import 'bootstrap';
import { SocketService } from '../../services/socket.service';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { GridOption } from '../../common/grid-control/grid-control';
import { UtilityService } from '../../services/utility-service/utility.service';
declare var $: any;
@Component({
  selector: 'system-code-detail',
  templateUrl: './system-code-detail.component.html'
})

export class SystemCodeDetailComponent implements OnInit, DynamicComponent {
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();

  @ViewChild('grid') grid: GridControlComponent;
  @ViewChild('gridDetail') gridDetail: GridControlComponent;
  gridOption: GridOption;

  entity: any = {};

  constructor(private router: Router,
    private appServices: AppServices,
    private notifyService: NotifyService,
    private utilityService: UtilityService,
    private socketService: SocketService) {
    this.tabReload.subscribe(data => {
      if (data) {
        this.entity = Object.assign({}, data);
        if (this.grid) this.grid.reload();
      } else this.entity = {};
    });
  }

  ngOnInit() {
    this.initGrid();
  }

  initGrid() {
    this.gridOption = new GridOption();
    this.gridOption.component = this;
    this.gridOption.editable = true;
    this.gridOption.addable = true;
    this.gridOption.key = 'SystemCodeDetailComponent';
    this.gridOption.url = '/api/Codelkups/find';
    this.gridOption.customFilter = () => {
      return {
        'whseid': this.appServices.account.whseid, 
        'listname': this.entity.listname, 'deleted': false
      }
    };
    this.gridOption.commands = [];
    this.gridOption.columns = [{
      field: 'code',
      title: 'Code',
      type: 'string',
      width: '100px'
    }, {
      field: 'description',
      title: 'Description',
      type: 'string',
      width: '100px'
    }, {
      field: 'short',
      title: 'Short',
      type: 'string',
      width: '100px'
    }, {
      field: 'long_value',
      title: 'Long Value',
      type: 'string',
      width: '100px'
    }, {
      field: 'woflag',
      title: 'Woflag',
      type: 'string',
      width: '100px'
    }, {
      field: 'lot1',
      title: 'Lot1',
      type: 'string',
      width: '100px'
    }, {
      field: 'notes',
      title: 'Notes',
      type: 'string',
      width: '100px'
    }];
  }

  importExcel(records: any[]) {
    let promises = [];
    records.forEach((record, index) => {
      let promise = new Promise((resolve, reject) => {
        record['whseid'] = this.appServices.account.whseid;
        record['listname'] = this.entity.listname;
        record['currentuser'] = this.appServices.account.username;
        record['deleted'] = false;
        this.appServices._insertCodelkup({ 'obj': JSON.stringify(record) }, this).then((__) => {
          resolve();
        }).catch((err) => {
          this.notifyService.error('Error at row: ' + (index + 1));
          resolve();
        });
      });
      promises.push(promise);
    });
    Promise.all(promises).then(() => {
      this.notifyService.success('Process Done');
      this.gridDetail.reload();
    });
  }

  saveRow(data) {
    data['currentuser'] = this.appServices.account.username;
    if (data.id) {
      this.appServices._updateCodelkup({ 'obj': JSON.stringify(data) }, this).then(obj => {
        this.notifyService.success('Process Done');
        this.grid.reload();
      }).catch(err => {
        this.utilityService.handleError(err);
      })
    } else {
      data['whseid'] = this.appServices.account.whseid;
      data['listname'] = this.entity.listname,
        data['deleted'] = false;
      this.appServices._insertCodelkup({ 'obj': JSON.stringify(data) }, this).then(obj => {
        this.notifyService.success('Process Done');
        this.gridDetail.reload();
      }).catch(err => {
        this.utilityService.handleError(err);
      })
    }
  }

  save() {
    let data = Object.assign({}, this.entity);
    data['whseid'] = this.appServices.account.whseid;
    data['deleted'] = false;
    data['currentuser'] = this.appServices.account.username;
    if (data.id) {
      this.appServices._updateCodelist({ 'obj': JSON.stringify(data) }, this).then(obj => {
        this.notifyService.success('Process Done');
        this.grid.reload();
        this.socketService.send({
          code: 'SYSTEMCODE_UPDATE',
          data: data
        });
      }).catch(err => {
        this.utilityService.handleError(err);
      });
    } else {
      this.appServices._insertCodelist({ 'obj': JSON.stringify(data) }, this).then(obj => {
        this.notifyService.success('Process Done');
        this.entity = obj.response.json().res;
        this.socketService.send({
          code: 'SYSTEMCODE_CREATE',
          data: data
        });
        this.initGrid();
      }).catch(err => {
        this.utilityService.handleError(err);
      });
    }
  }
}
