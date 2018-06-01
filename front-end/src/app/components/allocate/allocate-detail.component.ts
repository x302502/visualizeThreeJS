import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { ModalComponent } from '../../common/modal.component';
import { CompleterService, CompleterData } from 'ng2-completer';
import { PopupZoneComponent } from '../../common/popup-zone/popup-zone.component';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import * as uuid from 'uuid';

import * as $ from 'jquery';
import 'bootstrap';
import { AllocateListComponent } from './allocate-list.component';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'allocate-detail',
  templateUrl: './allocate-detail.component.html'
})

export class AllocateDetailComponent implements OnInit, DynamicComponent {
  //#region Dynamic Component
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  //#endregion
  entity: any = {};
  data_temp;
  data_allocatedetail = [];
  data_uom = [];
  index_allocatedetail = -1; stt = 1;
  selected_allocatedetail;
  id: any;
  constructor(private appServices: AppServices,
    private notifyService: NotifyService,
    private socketService: SocketService) {
    this.tabReload.subscribe(data => {
      if(data) {
        this.entity = Object.assign({}, data);
        this.loadAllocateDetailData();
      } else {
        this.entity = {};
        this.data_allocatedetail = [];
      }
    });
  }

  ngOnInit() {
    this.loadUOMData();
    this.id = {
      modalDelete: uuid.v4()
    }
  }


  loadAllocateDetailData() {
    this.appServices.findAllocatestrategydetails({ 'filter': JSON.stringify({ 'where': { 'whseid': this.appServices.account.whseid, 'deleted': false, 'allocatestrategykey': this.entity.allocatestrategykey } }) }, this)
      .then((__) => {
        this.data_allocatedetail = __.response.json().res;
      }).catch((err) => {
        this.notifyService.error(err.err.json().error.message);
      })
  }

  loadUOMData() {
    this.appServices.findCodelkup({ 'filter': JSON.stringify({ 'where': { 'whseid': this.appServices.account.whseid, 'listname': 'QUANTITY', 'deleted': false } }) }, this).then((obj) => {
      this.data_uom = obj.response.json().res;
    }).catch((err) => {
      this.notifyService.error(err.err.json().error.message);
    })
  }

  newAllocate() {
    this.entity = {};
    this.data_allocatedetail = [];
  }

  addNewRow() {
    this.data_temp = {
      'whseid': this.appServices.account.whseid,
      'allocatestrategylinenumber': '',
      'uom': '',
      'pickcode': '',
      'locationtypeoverride': '',
      'locationtypeoverridestripe': '',
      'allowoverallocations': false,
      'pickcodesql': '',
      'stepnumber': 0,
      'groupuompicks': false,
      'descr': ''
    };
  }

  saveAllocateData(data) {
    data['whseid'] = this.appServices.account.whseid;
    data['deleted'] = false;
    data['currentuser'] = this.appServices.account.username;
    if (data.id) {
      this.appServices._updateAllocatestrategy({ 'obj': JSON.stringify(data) }, this).then((__) => {
        this.entity = __.response.json().res;
        this.socketService.send({
          code: "ALLOCATE_UPDATE",
          data: this.entity
        });
        this.notifyService.success('Process Done');
      }).catch((err) => {
      this.notifyService.error(err.err.json().error.message);
      });
    } else {
      this.appServices._insertAllocatestrategy({ 'obj': JSON.stringify(data) }, this).then((__) => {
        this.entity = __.response.json().res;
        this.socketService.send({
          code: "ALLOCATE_CREATE",
          data: this.entity
        });
        this.notifyService.success('Process Done');
      }).catch((err) => {
      this.notifyService.error(err.err.json().error.message);
      });
    }
  }

  saveRow(data) {
    data['allocatestrategykey'] = this.entity.allocatestrategykey;
    data['whseid'] = this.appServices.account.whseid;
    data['allowoverallocations'] = data['allowoverallocations'] == 1 ? true : false;
    data['groupuompicks'] = data['groupuompicks'] == 1 ? true : false;
    data['deleted'] = false;
    data['currentuser'] = this.appServices.account.username;
    if (data.id) {
      this.appServices._updateAllocatestrategydetails({ 'obj': JSON.stringify(data) }, this).then((__) => {
        this.data_allocatedetail = __.response.json().res;
        this.notifyService.success('Process Done');
      }).catch((err) => {
      this.notifyService.error(err.err.json().error.message);
      })
    } else {
      this.appServices._insertAllocatestrategydetails({ 'obj': JSON.stringify(data) }, this).then((__) => {
        this.data_allocatedetail = __.response.json().res;
        this.notifyService.success('Process Done');
      }).catch((err) => {
      this.notifyService.error(err.err.json().error.message);
      })
    }
  }

  deleteRow() {
    let data = this.selected_allocatedetail;
    data['allocatestrategykey'] = this.entity.allocatestrategykey;
    data['allowoverallocations'] = data['allowoverallocations'] == 1 ? true : false;
    data['groupuompicks'] = data['groupuompicks'] == 1 ? true : false;
    data['deleted'] = true;
    data['currentuser'] = this.appServices.account.username;
    this.appServices._updateAllocatestrategydetails({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
      let res = obj.response.json().res;
      obj.component.notifyService.show('Process Done');
      obj.component.loadAllocateDetailData();
      $('#modalDeleteAllocateDetail').modal('hide');
    }).catch((err) => {
      this.notifyService.error(err.err.json().error.message);
    })
  }


  @ViewChild('modalZone') child_zone: PopupZoneComponent;
  openModalZone(stt, index) {
    this.stt = stt;
    this.index_allocatedetail = index;
    this.child_zone.openModal();
  }
  selectZone(data) {
    switch (this.stt) {
      case -1: {
        this.data_temp.zonepcs = data.putawayzone;
        break;
      }
      case 1: {
        this.data_allocatedetail[this.index_allocatedetail].zonepcs = data.putawayzone;
        break;
      }
      default: {
        break;
      }
    }
  }

}
