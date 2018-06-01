import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { ModalComponent } from '../../common/modal.component';
import { CompleterService, CompleterData } from 'ng2-completer';
import { PopupLocationComponent } from '../../common/popup-location/popup-location.component';
import { PopupZoneComponent } from '../../common/popup-zone/popup-zone.component';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import * as uuid from 'uuid';

import * as $ from 'jquery';
import 'bootstrap';
import { PutawayListComponent } from './putaway-list.component';
import { SocketService } from '../../services/socket.service';
import { UtilityService } from '../../services/utility-service/utility.service';

@Component({
  selector: 'putaway-detail',
  templateUrl: './putaway-detail.component.html'
})

export class PutawayDetailComponent implements OnInit, DynamicComponent {
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  entity: any = {};
  selected_shipcode;
  selected_item;
  data_temp;
  data_putawaydetail = [];
  data_uom = [];
  index_putawaydetail = -1; stt = 1;
  selected_putawaydetail;
  id: any;

  constructor(private router: Router,
    private appServices: AppServices,
    private notifyService: NotifyService,
    private socketService: SocketService,
    private utilityService: UtilityService) {
    this.tabReload.subscribe(data => {
      this.entity = data;
      if (Object.keys(this.entity).length > 0) this.loadPutawayDetailData();
      else this.data_putawaydetail = [];
    });
  }

  ngOnInit() {
    this.id = {
      modalDelete: uuid.v4()
    }
  }

  loadPutawayDetailData() {
    this.appServices.findPutawaystrategydetails({ 'filter': JSON.stringify({ 'where': { 'whseid': this.appServices.account.whseid, 'deleted': false, 'putawaystrategykey': this.entity.putawaystrategykey } }) }, this)
      .then((__) => {
        this.data_putawaydetail = __.response.json().res;
      }).catch((err) => {
        this.notifyService.error(err.err.json().error.message);
      })
  }

  newPutaway() {
    this.entity = {};
    this.data_putawaydetail = [];

  }

  addNewRow() {
    $('#tbldetail').scrollTop(0);
    this.data_temp = {
      'whseid': this.appServices.account.whseid,
      'putawaystrategylinenumber': '',
      'fromloc': '',
      'toloc': '',
      'areakey': '',
      'zone': '',
      'stepnumber': 0
    };
  }

  saveputawayData(data) {
    data['whseid'] = this.appServices.account.whseid;
    data['deleted'] = false;
    data['currentuser'] = this.appServices.account.username;
    if (data.id) {
      this.appServices._updatePutawaystrategies({ 'obj': JSON.stringify(data) }, this).then((__) => {
        this.entity = __.response.json().res;
        this.socketService.send({
          code: "PUTAWAY_UPDATE",
          data: this.entity
        });
        this.notifyService.success('Process Done');
      }).catch((err) => {
        this.utilityService.handleError(err);
      });
    } else {
      this.appServices._insertPutawaystrategies({ 'obj': JSON.stringify(data) }, this).then((__) => {
        this.entity = __.response.json().res;
        this.socketService.send({
          code: "PUTAWAY_CREATE",
          data: this.entity
        });
        this.notifyService.success('Process Done');
      }).catch((err) => {
        this.notifyService.error(err.err.json().error.message);
      });
    }
  }

  saveRow(data) {
    data['putawaystrategykey'] = this.entity.putawaystrategykey;
    data['whseid'] = this.appServices.account.whseid;
    data['deleted'] = false;
    data['currentuser'] = this.appServices.account.username;
    if (data.id) {
      this.appServices._updatePutawaystrategydetails({ 'obj': JSON.stringify(data) }, this).then((__) => {
        this.data_putawaydetail = __.response.json().res;
        this.notifyService.success('Process Done');
      }).catch((err) => {
        this.utilityService.handleError(err);
      });
    } else {
      this.appServices._insertPutawaystrategydetails({ 'obj': JSON.stringify(data) }, this).then((__) => {
        this.data_putawaydetail = __.response.json().res;
        this.notifyService.success('Process Done');
      }).catch((err) => {
        this.utilityService.handleError(err);
      });
    }
  }

  deleteRow() {
    let data = this.selected_putawaydetail;
    data['currentuser'] = this.appServices.account.username;
    data['deleted'] = true;
    this.appServices._updatePutawaystrategydetails({ 'obj': JSON.stringify(data) }, this).then((obj) => {
      let res = obj.response.json().res;
      this.notifyService.success('Process Done');
      this.loadPutawayDetailData();
      $('#modalDeleteputawayDetail').modal('hide');
    }).catch((err) => {
      this.utilityService.handleError(err);
    })
  }

  @ViewChild('modalLocation') modalLocation: PopupLocationComponent;
  openModalLocation(stt, index) {
    this.stt = stt;
    this.index_putawaydetail = index;
    this.modalLocation.openModal();
  }
  selectLocation(data) {
    switch (this.stt) {
      case -1: {
        this.data_temp.fromloc = data.loc;
        break;
      }
      case -2: {
        this.data_temp.toloc = data.loc;
        break;
      }
      case 1: {
        this.data_putawaydetail[this.index_putawaydetail].fromloc = data.loc;
        break;
      }
      case 2: {
        this.data_putawaydetail[this.index_putawaydetail].toloc = data.loc;
        break;
      }
      default: {
        break;
      }
    }
  }

  @ViewChild('modalZone') child_zone: PopupZoneComponent;
  openModalZone(stt, index) {
    this.stt = stt;
    this.index_putawaydetail = index;
    this.child_zone.openModal();
  }
  selectZone(data) {
    switch (this.stt) {
      case -1: {
        this.data_temp.zone = data.putawayzone;
        break;
      }
      case 1: {
        this.data_putawaydetail[this.index_putawaydetail].zone = data.putawayzone;
        break;
      }
      default: {
        break;
      }
    }
  }

}
