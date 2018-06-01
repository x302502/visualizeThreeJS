import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { SocketService } from '../../services/socket.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { LocationListComponent } from './location-list.component';

import * as $ from 'jquery';
import 'bootstrap';
import { UtilityService } from '../../services/utility-service/utility.service';

@Component({
  selector: 'location-detail',
  templateUrl: './location-detail.component.html',
})
export class LocationDetailComponent implements OnInit, DynamicComponent {
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  entity;
  data_codelkup = [];
  data_zone = [];

  constructor(private appServices: AppServices,
    private notifyService: NotifyService,
    private socketService: SocketService,
    private utilityService: UtilityService) {
    this.tabReload.subscribe(data => {
      if (data) this.entity = Object.assign({}, data);
      else this.entity = {};
    });
  }

  ngOnInit() {
    this.loadCodelkupData();
    this.loadZoneData();
  }

  loadCodelkupData() {
    this.appServices.findCodelkup({ 'filter': JSON.stringify({ 'where': { 'whseid': this.appServices.account.whseid, 'listname': "LOCSTATUS", 'deleted': false } }) }, this).then((__) => {
      this.data_codelkup = __.response.json().res;
    }).catch((err) => {
      this.utilityService.handleError(err);
    })
  }
  loadZoneData() {
    this.appServices.findZone({ 'filter': JSON.stringify({ 'where': { 'whseid': this.appServices.account.whseid, 'deleted': false } }) }, this).then((__) => {
      this.data_zone = __.response.json().res;
    }).catch((err) => {
      this.utilityService.handleError(err);
    })
  }

  save(data) {
    if (data.addwho) {
      this.update(data);
    } else {
      this.insert(data);
    }
  }

  insert(data) {
    data['whseid'] = this.appServices.account.whseid;
    data['currentuser'] = this.appServices.account.username;
    this.appServices._insertLocation({ 'obj': JSON.stringify(data) }, this).then((__) => {

      this.entity = __.response.json().res;
      this.socketService.send({
        code: "LOCATION_CREATE",
        data: this.entity
      });
      this.notifyService.success('Process Done');
    }).catch(err => {
      this.utilityService.handleError(err);
    })
  }
  update(data) {
    data['whseid'] = this.appServices.account.whseid;
    data['deleted'] = false;
    data['currentuser'] = this.appServices.account.username;
    this.appServices._updateLocation({ 'obj': JSON.stringify(data) }, this).then((__) => {

      this.entity = __.response.json().res;
      this.socketService.send({
        code: "LOCATION_UPDATE",
        data: this.entity
      });
      this.notifyService.success('Process Done');
    }).catch(err => {
      this.utilityService.handleError(err);
    })
  }
}
