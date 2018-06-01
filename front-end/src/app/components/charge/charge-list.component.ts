import { Component, OnInit,ElementRef,ViewChild, EventEmitter } from '@angular/core';

import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DatePipe } from '@angular/common';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { debuglog } from 'util';
import * as $ from 'jquery';
import 'bootstrap';
import { DynamicTabItem, DynamicComponent } from '../../common/dynamic-loader/dynamic-loader.model';
@Component({
  selector: 'app-charge-list',
  templateUrl: './charge-list.component.html',
  styleUrls: ['./charge-list.component.css']
})
export class ChargeListComponent implements DynamicComponent {
  //#region Dynamic Component
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  //#endregion
  filter;data_charge; count_charge = 0;total_charge; data_rows; currentPage = 1; itemsPerPage = 12; total = 0; data_temp;
  showEditTable = false; editRow:any = ''; selected_charge

constructor(private appServices: AppServices, private notifyService: NotifyService) { }

  ngOnInit() {
    this.loadChargeData();
  }
  newChargeData(data) {
    data.whseid = this.appServices.account.whseid;
    data.username = this.appServices.account.username;
    this.appServices.insertCharge({'obj': JSON.stringify(data)}, this).then(function(obj) {
      const res = obj.response.res;
      obj.component.notifyService.show('Process Done');
      obj.component.loadChargeData();
      $('#ModalCreateNewChargeList').modal('hide');
     
    }).catch(function (err) {
      err.component.notifyService.show(err.err.json().err.message, 'danger');
    });
  }
  loadChargeData(param?: Object) {
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
    this.appServices.findCharge({'filter': JSON.stringify({'where': $.extend({'whseid': this.appServices.account.whseid, 'deleted': false}, this.filter), 'skip': skip,'limit':limit})}, this)
     .then(function (obj) {
      let json = obj.response.json();
      obj.component.data_charge = json.res;
      console.log(obj.component.data_charge);
      
      obj.component.total = json.total;
    }).catch(function (err) {
      err.component.notifyService.show(err.err.json().error.message, 'danger');
    });
  }
  Edit(data) {
    this.editRow = data;
  }
  BacktoEdit(data) {
    this.editRow = !data;
    this.loadChargeData();
  }
  UpdateChargeRow(data){
  data['whseid'] = this.appServices.account.whseid;
  data['username'] = this.appServices.account.username;
  data['deleted'] = false;
  this.appServices.updateCharge({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
    const res = obj.response.res;
    obj.component.notifyService.show('Process Done');
    obj.component.loadChargeData();
  }).catch(function (err) {
    err.component.notifyService.show(err.err.json().err.message, 'danger');
  });
  }
  cancel(data){
    this.editRow = !data;
    this.loadChargeData();
  }
  DeleteChargeData(data) {
  data['whseid'] = this.appServices.account.whseid;
  data['username'] = this.appServices.account.username;
  data['deleted'] = true;
  this.appServices.updateCharge({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
    const res = obj.response.res;
    obj.component.notifyService.show('Process Done');
    obj.component.loadChargeData();
    $('#modalDelete').modal('hide');
  }).catch(function (err) {
    err.component.notifyService.show(err.err.json().err.message, 'danger');
  });
  }
}
