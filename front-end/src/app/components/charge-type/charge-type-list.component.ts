import { Component, OnInit,ElementRef,ViewChild, EventEmitter } from '@angular/core';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';

import * as $ from 'jquery';
import 'bootstrap';
import { DynamicTabItem, DynamicComponent } from '../../common/dynamic-loader/dynamic-loader.model';

@Component({
  selector: 'app-charge-type-list',
  templateUrl: './charge-type-list.component.html',
  styleUrls: ['./charge-type-list.component.css']
})
export class ChargeTypeListComponent implements DynamicComponent {
  //#region Dynamic Component
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  //#endregion
  filter;data_chargetype; count_chargetype = 0;total_chargetype; data_rows;
  showEditTable = false; editRow:any = ''; currentPage = 1; itemsPerPage = 12; total = 0; data_temp;
  propertyName ; order = 'ASC';

  constructor(private appServices: AppServices, private notifyService: NotifyService) { }
  ngOnInit() {
    this.loadChargeTypeData();
  }
  newChargeTypeData(data) {
    data.whseid = this.appServices.account.whseid;
    data.username = this.appServices.account.username;
    this.appServices.insertChargeType({'obj': JSON.stringify(data)}, this).then(function(obj) {
      const res = obj.response.res;
      obj.component.notifyService.show('Process Done');
      obj.component.loadChargeTypeData();
      $('#ModalCreateNewChargeType').modal('hide');
     
    }).catch(function (err) {
      err.component.notifyService.show(err.err.json().err.message, 'danger');
    });
  }
  loadChargeTypeData(param?: Object) {
    let skip = (this.currentPage-1)*this.itemsPerPage;
    let limit =  this.itemsPerPage;
    this.data_temp = null;
    let filter;
    if (param) {
      this.filter = $.extend(this.filter, param);
      let paramIndex = Object.keys(this.filter).indexOf(Object.keys(param)[0]);
      if (!(Object.values(this.filter)[paramIndex])) {
        delete this.filter[Object.keys(param)[0]];
      }
    }
    this.appServices.findChargeType({'filter': JSON.stringify({'where': $.extend({'whseid': this.appServices.account.whseid, 'deleted': false}, filter), 'skip': skip, 'limit': limit, 'order': this.propertyName ? this.propertyName + " " + this.order : null})}, this)
     .then(function (obj) {
      let json = obj.response.json();
      obj.component.data_chargetype = json.res;
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
    this.loadChargeTypeData();
  }
  UpdateChargeTypeRow(data){
  
  data['whseid'] = this.appServices.account.whseid;
  data['username'] = this.appServices.account.username;
  data['deleted'] = false;
  this.appServices.updateChargeType({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
    const res = obj.response.res;
    obj.component.notifyService.show('Process Done');
    obj.component.loadChargeTypeData();
  }).catch(function (err) {
    err.component.notifyService.show(err.err.json().err.message, 'danger');
  });
  }
  cancel(data){
    this.editRow = !data;
    this.loadChargeTypeData();
  }
  DeleteChargeTypeData(data) {
  data['whseid'] = this.appServices.account.whseid;
  data['username'] = this.appServices.account.username;
  data['deleted'] = true;
  this.appServices.updateChargeType({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
    const res = obj.response.res;
    obj.component.notifyService.show('Process Done');
    obj.component.loadChargeTypeData();
    $('#modalDelete').modal('hide');
  }).catch(function (err) {
    err.component.notifyService.show(err.err.json().err.message, 'danger');
  });
  }
}
