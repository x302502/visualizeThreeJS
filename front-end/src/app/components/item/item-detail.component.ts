import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { PasteService } from './../../paste.service';
import { DatePipe } from '@angular/common';
import { ModalComponent } from '../../common/modal.component';
import { PopupLocationComponent } from '../../common/popup-location/popup-location.component';
import { PopupZoneComponent } from '../../common/popup-zone/popup-zone.component';
import { PopupAllocateStrategyComponent } from '../../common/popup-allocate-strategy/popup-allocate-strategy.component';
import { PopupPackComponent } from '../../common/popup-pack/popup-pack.component';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';

import * as $ from 'jquery';
import 'bootstrap';
import { ItemListComponent } from './item-list.component';
import { SocketService } from '../../services/socket.service';
import { UtilityService } from '../../services/utility-service/utility.service';
import { PopupPutawayStrategyComponent } from '../../common/popup-putaway-strategy/popup-putaway-strategy.component';

@Component({
  selector: 'item-detail',
  templateUrl: './item-detail.component.html'
})

export class ItemDetailComponent implements OnInit, DynamicComponent {
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  entity
  data_rotateby = [];
  data_rotatefield = [];

  constructor(private router: Router,
    private appServices: AppServices,
    private notifyService: NotifyService,
    private socketService: SocketService,
    private utilityService: UtilityService) {
    this.tabReload.subscribe(data => {
      if (data) this.entity = Object.assign({}, data);
      else this.entity = {};
    });
  }

  ngOnInit() {
    this.loadRotateByData();
    this.loadRotateFiledData();
  }

  saveItemData(data) {
    if (data.addwho) {
      this.updateItemData(data);
    } else {
      this.insertItemData(data);
    }
  }

  loadRotateByData() {
    this.appServices.findCodelkup({ 'filter': JSON.stringify({ 'where': { 'whseid': this.appServices.account.whseid, 'listname': "ROTATEBY", 'deleted': false } }) }, this)
      .then((__) => {
        this.data_rotateby = __.response.json().res;
      }).catch(err => {
        this.utilityService.handleError(err);
      })
  }

  loadRotateFiledData() {
    this.appServices.findCodelkup({ 'filter': JSON.stringify({ 'where': { 'whseid': this.appServices.account.whseid, 'listname': "ROTATEFIELD", 'deleted': false } }) }, this)
      .then((__) => {
        this.data_rotatefield = __.response.json().res;
      }).catch(err => {
        this.utilityService.handleError(err);
      })
  }

  insertItemData(data) {
    data['whseid'] = this.appServices.account.whseid;
    data['currentuser'] = this.appServices.account.username;
    this.appServices._insertSku({ 'obj': JSON.stringify(data) }, this).then((__) => {
      let item = __.response.json().res;
      this.entity = item;
      this.socketService.send({
        code: "ITEM_CREATE",
        data: item
      });
      this.notifyService.success('Process Done');
    }).catch(err => {
      this.utilityService.handleError(err);
    })
  }

  updateItemData(data) {
    data['whseid'] = this.appServices.account.whseid;
    data['deleted'] = false;
    data['currentuser'] = this.appServices.account.username;
    this.appServices._updateSku({ 'obj': JSON.stringify(data) }, this).then((__) => {
      let item = __.response.json().res;
      this.socketService.send({
        code: "ITEM_UPDATE",
        data: item
      });
      this.notifyService.success('Process Done');
    }).catch(err => {
      this.utilityService.handleError(err);
    });
  }

  @ViewChild('modalLocation') modalLocation: PopupLocationComponent;
  openModalLocation() {
    this.modalLocation.openModal();
  }
  selectLocation(data) {
    this.entity.locationpickcase = data.loc;
  }

  @ViewChild('modalZone') modalZone: PopupZoneComponent;
  openModalZone(i, id) {
    this.modalZone.openModal();
  }
  selectZone(data) {
    this.entity.putawayzone = data.putawayzone;
  }

  @ViewChild('modalAllocateStrategy') modalAllocateStrategy: PopupAllocateStrategyComponent;
  openmodalAllocateStrategy(i, id) {
    this.modalAllocateStrategy.openModal();
  }
  selectAllocateStrategy(data) {
    this.entity.strategykey = data.allocatestrategykey;
  }

  @ViewChild('modalPack') modalPack: PopupPackComponent;
  openModalPack() {
    this.modalPack.openModal();
  }
  selectPack(data) {
    this.entity.packkey = data.packkey;
  }

  @ViewChild('modalPutawayStrategy') modalPutawayStrategy: PopupPutawayStrategyComponent;
  openModalPutawayStrategy() {
    this.modalPutawayStrategy.openModal();
  }
  selectPutawayStrategy(data) {
    this.entity.putawaystrategykey = data.putawaystrategykey;
  }

}
