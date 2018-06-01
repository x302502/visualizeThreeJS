import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';

import * as jQuery from 'jquery';
import 'bootstrap';
import { SupplierListComponent } from './supplier-list.component';
import { SocketService } from '../../services/socket.service';
import { UtilityService } from '../../services/utility-service/utility.service';
declare var $: any;
@Component({
  selector: 'supplier-detail',
  templateUrl: './supplier-detail.component.html'
})

export class SupplierDetailComponent implements OnInit, DynamicComponent {
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  selected_supplier;
  data_supplier = [];

  constructor(private appServices: AppServices,
    private notifyService: NotifyService,
    private socketService: SocketService,
    private utilityService: UtilityService) {
    this.tabReload.subscribe(data => {
      this.selected_supplier = data;
    });
  }

  ngOnInit() {
  }

  save(data) {
    if (data.addwho) {
      this.update(data);
    } else {
      this.insert(data);
    }
  }

  insert(data) {
    data['type'] = "5";
    data['whseid'] = this.appServices.account.whseid;
    data['deleted'] = false;
    data['currentuser'] = this.appServices.account.username;
    this.appServices._insertStorer({ 'obj': JSON.stringify(data) }, this).then((__) => {
      this.selected_supplier = __.response.json().res;
      this.socketService.send({
        code: "SUPPLIER_CREATE",
        data: this.selected_supplier
      });
      this.notifyService.success('Process Done');
    }).catch((err) => {
      this.utilityService.handleError(err);
    });
  }
  
  update(data) {
    data['type'] = "5";
    data['whseid'] = this.appServices.account.whseid;
    data['deleted'] = false;
    data['currentuser'] = this.appServices.account.username;
    this.appServices._updateStorer({ 'obj': JSON.stringify(data) }, this).then((__) => {
      this.selected_supplier = __.response.json().res;
      this.socketService.send({
        code: "SUPPLIER_UPDATE",
        data: this.selected_supplier
      });
      this.notifyService.success('Process Done');
    }).catch((err) => {
      this.utilityService.handleError(err);
    });
  }

  redirectTosupplierList() {
    let dynamicTabItem: DynamicTabItem = {
      title: 'Supplier List',
      component: SupplierListComponent,
      data: null
    }
    this.tabEmitter.emit(dynamicTabItem);
  }
}
