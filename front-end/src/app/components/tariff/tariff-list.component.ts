import { Component, OnInit, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DatePipe } from '@angular/common';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';

import * as $ from 'jquery';
import 'bootstrap';
import { DynamicTabItem, DynamicComponent } from '../../common/dynamic-loader/dynamic-loader.model';

@Component({
  selector: 'app-tariff-list',
  templateUrl: './tariff-list.component.html',
  styleUrls: ['./tariff-list.component.css']
})
export class TariffListComponent implements DynamicComponent {
  //#region Dynamic Component
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  //#endregion
  filter; data_tariff; count_tariff = 0; total_tariff; data_rows; data_chargetype; data_charge; currentPage = 1; itemsPerPage = 12; total = 0; data_temp;
  showEditTable = false; editRow: any = ''; selected_tariff; data_tariffdetail; count_tariffdetail; total_detail = 0;currentPage_detail = 1; itemsPerPage_detail = 5;
  @ViewChild('tabDetail') el: ElementRef;
  constructor(private datePipe: DatePipe, private appServices: AppServices, private notifyService: NotifyService) { }

  ngOnInit() {
    this.loadTariffData();
  }
  newtariffData(data) {
    data.whseid = this.appServices.account.whseid;
    data.username = this.appServices.account.username;
    data.validityfrom = new Date(data.validityfrom);
    data.validityto = new Date(data.validityto);
    console.log(data);
    if ( data.validityfrom.getTime() > data.validityto.getTime()) {
      this.notifyService.show('Validityfrom date must be less than Validityto date!','warning');
      // this.loadTariffData();
    } else {
      this.appServices.insertTariff({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
        const res = obj.response.res;
        obj.component.notifyService.show('Process Done');
        obj.component.loadTariffData();
        $('#ModalCreateNewTariff').modal('hide');
      }).catch(function (err) {
        err.component.notifyService.show(err.err.json().err.message, 'danger');
      });
    }
  }
  loadTariffData(param?: Object) {
    let skip = (this.currentPage-1)*this.itemsPerPage;
    let limit =  this.itemsPerPage;
    this.data_temp = null;
    if (param) {
      this.filter = $.extend(this.filter, param);
      let paramIndex = Object.keys(this.filter).indexOf(Object.keys(param)[0]);
      if (!(Object.values(this.filter)[paramIndex])) {
        delete this.filter[Object.keys(param)[0]];
      }
    }
    this.appServices.findTariff({ 'filter': JSON.stringify({ 'where': $.extend({ 'whseid': this.appServices.account.whseid, 'deleted': false }, this.filter), 'skip': skip }) }, this)
      .then(function (obj) {
        let json = obj.response.json();
        obj.component.data_tariff = json.res;
        obj.component.total = json.total;
        console.log(obj.component.total);
      }).catch(function (err) {
        err.component.notifyService.show(err.err.json().error.message, 'danger');
      });
    this.loadChargetypeFromWarehouse();
  }
  Edit(data) {
    this.editRow = data;
    console.log(this.editRow);
  }
  BacktoEdit(data) {
    this.editRow = !data;
  }
  UpdateTariffRow(data) {
    data['whseid'] = this.appServices.account.whseid;
    data['username'] = this.appServices.account.username;
    data['deleted'] = false;
    if ( data.validityfrom.getTime() > data.validityto.getTime()) {
      this.notifyService.show('Validityfrom date must be less than Validityto date!','warning');
      this.loadTariffData();
    } else {
      this.appServices.updateTariff({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
        const res = obj.response.res;
        obj.component.notifyService.show('Process Done');
        obj.component.loadtariffData();
      }).catch(function (err) {
        err.component.notifyService.show(err.err.json().err.message, 'danger');
      });
    }
    console.log(data);
    
  }
  cancel(data) {
    this.editRow = !data;
    this.loadTariffData();
  }
  DeleteTariffData(data) {
    data['whseid'] = this.appServices.account.whseid;
    data['username'] = this.appServices.account.username;
    data['deleted'] = true;
    console.log(data);
    this.appServices.updateTariff({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
      const res = obj.response.res;
      obj.component.notifyService.show('Process Done');
      obj.component.loadtariffData();
      $('#modalDelete').modal('hide');
    }).catch(function (err) {
      err.component.notifyService.show(err.err.json().err.message, 'danger');
    });
  }
  // load chargetype from warehouse
  loadChargetypeFromWarehouse() {
    this.appServices.findChargeType({ 'filter': JSON.stringify({ 'where': $.extend({ 'whseid': this.appServices.account.whseid, 'deleted': false }, this.filter) }) }, this)
      .then(function (obj) {
        const json = obj.response.json();
        obj.component.data_chargetype = json.res;
        console.log(obj.component.data_chargetype);
      }).catch(function (err) {
        err.component.notifyService.show(err.err.json().error.message, 'danger');
      });
    this.loadChargeCodeFromChargetype(this.data_charge);
  }
  // load chargecode from chargetype
  loadChargeCodeFromChargetype(data) {
    console.log(data);
    this.appServices.findCharge({ 'filter': JSON.stringify({ 'where': $.extend({ 'whseid': this.appServices.account.whseid, 'chargetypecode': data, 'deleted': false }, this.filter) }) }, this)
      .then(function (obj) {
        const json = obj.response.json();
        obj.component.data_charge = json.res;
      }).catch(function (err) {
        err.component.notifyService.show(err.err.json().error.message, 'danger');
      });
  }
  CreateTariffDetail(data) {
    data.whseid = this.appServices.account.whseid;
    data.username = this.appServices.account.username;
    console.log(data);
    this.appServices.insertTariffdetail({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
      let res = obj.response.res;
      obj.component.notifyService.show('Process Done');
      obj.component.el.nativeElement.click($(function () {
        $('#modalNewDetail').modal('hide');
        $('#modalNewDetail1').modal('hide');
      }));
      // obj.component.loadTariffdetail();
    }).catch(function (err) {
        err.component.notifyService.show(err.err.json().err.message, 'danger');
      });
  }
  loadTariffdetail(param?: Object) {
    let skip = (this.currentPage_detail-1)*this.itemsPerPage_detail;
    let limit =  this.itemsPerPage_detail;
    this.data_temp = null;
    if (param) {
      this.filter = $.extend(this.filter, param);
      let paramIndex = Object.keys(this.filter).indexOf(Object.keys(param)[0]);
      if (!(Object.values(this.filter)[paramIndex])) {
        delete this.filter[Object.keys(param)[0]];
      }
    }
    this.appServices.findTariffdetail({ 'filter': JSON.stringify({ 'where': $.extend({ 'whseid': this.appServices.account.whseid, 'deleted': false }, this.filter), 'skip': skip }) }, this)
      .then(function (obj) {
        let json = obj.response.json();
        obj.component.data_tariffdetail = json.res;
        obj.component.total_detail = json.total;
        console.log(obj.component.data_tariffdetail);
        console.log(obj.component.total_detail);
      }).catch(function (err) {
        err.component.notifyService.show(err.err.json().error.message, 'danger');
      });
  }
  UpdateTariffDetailRow(data) {
    data['whseid'] = this.appServices.account.whseid;
    data['username'] = this.appServices.account.username;
    data['deleted'] = false;
    console.log(data);
    this.appServices.updateTariffdetail({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
      const res = obj.response.res;
      obj.component.notifyService.show('Process Done');
      obj.component.loadTariffdetail();
    }).catch(function (err) {
      err.component.notifyService.show(err.err.json().err.message, 'danger');
    });
  }
  DeleteTariffdetailData(data) {
    data['whseid'] = this.appServices.account.whseid;
    data['username'] = this.appServices.account.username;
    data['deleted'] = true;
    console.log(data);
    this.appServices.updateTariffdetail({'obj': JSON.stringify(data) }, this).then(function (obj) {
      const res = obj.response.res;
      obj.component.notifyService.show('Process Done');
      obj.component.loadTariffdetail();
      $('#modalDeletedetail').modal('hide');
    }).catch(function (err) {
      err.component.notifyService.show(err.err.json().err.message, 'danger');
    });
  }
  cancelDetail(data) {
    this.editRow = !data;
    this.loadTariffdetail();
  }
  CreateTariffDetailTab(data) {
    data.whseid = this.appServices.account.whseid;
    data.username = this.appServices.account.username;
    console.log(data);
    this.appServices.insertTariffdetail({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
      let res = obj.response.res;
      obj.component.notifyService.show('Process Done');
      $('#modalNewDetail1').modal('hide');
    
      // obj.component.loadTariffdetail();
    }).catch(function (err) {
        err.component.notifyService.show(err.err.json().err.message, 'danger');
      });
  }
}
