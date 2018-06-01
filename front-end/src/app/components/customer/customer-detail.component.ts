import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { ModalComponent } from '../../common/modal.component';
import { CompleterService, CompleterData } from 'ng2-completer';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';

import * as $ from 'jquery';
import 'bootstrap';
import { CustomerListComponent } from './customer-list.component';
import { SocketService } from '../../services/socket.service';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { GridOption } from '../../common/grid-control/grid-control';
import { UtilityService } from '../../services/utility-service/utility.service';

@Component({
  selector: 'customer-detail',
  templateUrl: './customer-detail.component.html'
})

export class CustomerDetailComponent implements OnInit, DynamicComponent {
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  @ViewChild('grid') grid: GridControlComponent;
  @ViewChild('gridDetail') gridDetail: GridControlComponent;
  gridOption: GridOption;
  entity: any = {};
  selected_shipcode;
  selected_item;
  data_temp;
  data_customergroup = [];
  data_shipcode = [];
  data_rotateby = [];
  data_rotatefield = [];

  constructor(private router: Router,
    private appServices: AppServices,
    private notifyService: NotifyService,
    private completerService: CompleterService,
    private socketService: SocketService) {
    this.tabReload.subscribe(data => {
      if (data) {
        this.entity = Object.assign({}, data);
        if (this.grid) this.grid.reload();
      } else this.entity = {};
    });
  }

  ngOnInit() {
    // this.loadCustomerGroupData();
    this. initGrid()
  }

  initGrid() {
    this.gridOption = new GridOption();
    this.gridOption.component = this;
    this.gridOption.editable = true;
    this.gridOption.addable = true;
    this.gridOption.key = 'ShipcodeComponent';
    this.gridOption.url = '/api/Shipcodes/find';
    this.gridOption.customFilter = () => {
      return {
        'whseid': this.appServices.account.whseid, 
        'storerkey': this.entity.storerkey,
        'deleted': false
      }
    };
    this.gridOption.commands = [];
    this.gridOption.columns = [{
      field: 'shipcode',
      title: 'Ship Code',
      type: 'string',
      width: '100px'
    }, {
      field: 'address',
      title: 'Address',
      type: 'string',
      width: '100px'
    }, {
      field: 'contact',
      title: 'Contact',
      type: 'string',
      width: '100px'
    }, {
      field: 'phone',
      title: 'Phone',
      type: 'string',
      width: '100px'
    }];
  }

  importExcel(records: any[]) {
    let promises = [];
    records.forEach((record, index) => {
      let promise = new Promise((resolve, reject) => {
        record['whseid'] = this.appServices.account.whseid; 
        record['storerkey'] = this.entity.storerkey;
        record['currentuser'] = this.appServices.account.username;
        record['deleted'] = false;
        this.appServices.saveShipcode({ 'obj': JSON.stringify(record) }, this).then((__) => {
          resolve();
        }).catch((err) => {
          this.notifyService.error('Error at row: ' + (index + 1));
          resolve();
        });
      });
      promises.push(promise);
    });
    Promise.all(promises).then(() => {
      this.socketService.send({
        code: "CUSTOMER_CREATE",
        data: this.entity
      });
      this.notifyService.success('Process Done');
      this.gridDetail.reload();
    });
  }

  save(data) {
    data['whseid'] = this.appServices.account.whseid;
    data['deleted'] = false;
    data['type'] = '2';
    data['currentuser'] = this.appServices.account.username;
    if (data.id) {
      this.appServices._updateStorer({ 'obj': JSON.stringify(data) }, this).then((__) => {
        this.entity = __.response.json().res;
        this.socketService.send({
          code: "CUSTOMER_UPDATE",
          data: this.entity
        });
        this.notifyService.success('Process Done');
      }).catch((err) => {
        this.notifyService.error(err.err.json().error.message);
      });
    } else {
      this.appServices._insertStorer({ 'obj': JSON.stringify(data) }, this).then((__) => {
        this.entity = __.response.json().res;
        this.socketService.send({
          code: "CUSTOMER_CREATE",
          data: this.entity
        });
        this.notifyService.success('Process Done');
      }).catch((err) => {
        this.notifyService.error(err.err.json().error.message);
      });
    }
  }


  saveRow(data) {
    data['currentuser'] = this.appServices.account.username;
    data['whseid'] = this.appServices.account.whseid; 
    data['storerkey'] = this.entity.storerkey;
    if (data.id) {
      this.appServices.updateShipcode({ 'obj': JSON.stringify(data) }, this).then((__) => {
        this.notifyService.success('Process Done');
      }).catch((err) => {
        this.notifyService.error(err.err.json().error.message);
      })
    } else {
      this.appServices.insertShipcode({ 'obj': JSON.stringify(data) }, this).then((__) => {
        this.notifyService.success('Process Done');
      }).catch((err) => {
        this.notifyService.error(err.err.json().error.message);
      })
    }
  }

  deleteShipcodeRow(shipcodeRow) {
    this.notifyService.confirmDelete().then(()=>{
      let data = Object.assign({}, shipcodeRow);
      data['deleted'] = true;
      data['currentuser'] = this.appServices.account.username;
      this.appServices.updateShipcode({ 'obj': JSON.stringify(data) }, this).then((__) => {
        this.notifyService.success('Process Done');
      }).catch((err) => {
        this.notifyService.error(err.err.json().error.message);
      });
    });
  }
}
