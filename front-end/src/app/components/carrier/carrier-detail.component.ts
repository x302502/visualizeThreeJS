import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { PasteService } from './../../paste.service';
import { DatePipe } from '@angular/common';
import { ModalService } from '../../common/modal.service';
import { ModalComponent } from '../../common/modal.component';
import { CompleterService, CompleterData } from 'ng2-completer';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';

import * as jQuery from 'jquery';
import 'bootstrap';
import { CarrierListComponent } from './carrier-list.component';
import { SocketService } from '../../services/socket.service';
declare var $: any;
@Component({
  selector: 'carrier-detail',
  templateUrl: './carrier-detail.component.html'
})

export class CarrierDetailComponent implements OnInit, DynamicComponent {
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  selected_carrier;
  data_carrier = [];

  constructor(private router: Router,
    private appServices: AppServices,
    private notifyService: NotifyService,
    private pasteService: PasteService,
    private datepipe: DatePipe,
    private modalService: ModalService,
    private completerService: CompleterService,
    private socketService: SocketService) {
    this.tabReload.subscribe(data => {
      this.selected_carrier = data;
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
    data['type'] = "3";
    data['whseid'] = this.appServices.account.whseid;
    data['deleted'] = false;
    data['currentuser'] = this.appServices.account.username;
    this.appServices._insertStorer({ 'obj': JSON.stringify(data) }, this).then((__) => {
      this.selected_carrier = __.response.json().res;
      this.socketService.send({
        code: "CARRIER_CREATE",
        data: this.selected_carrier
      });
      this.notifyService.success('Process Done');
    }).catch((err) => {
      this.notifyService.error(err.err.json().error.message);
    })
  }

  update(data) {
    data['type'] = "3";
    data['whseid'] = this.appServices.account.whseid;
    data['deleted'] = false;
    data['currentuser'] = this.appServices.account.username;
    this.appServices._updateStorer({ 'obj': JSON.stringify(data) }, this).then((__) => {
      this.selected_carrier = __.response.json().res;
      this.socketService.send({
        code: "CARRIER_UPDATE",
        data: this.selected_carrier
      });
      this.notifyService.success('Process Done');
    }).catch((err) => {
      this.notifyService.error(err.err.json().error.message);
    })
  }

  redirectToCarrierList() {
    let dynamicTabItem: DynamicTabItem = {
      title: 'Carrier List',
      component: CarrierListComponent,
      data: null
    }
    this.tabEmitter.emit(dynamicTabItem);
  }

}
