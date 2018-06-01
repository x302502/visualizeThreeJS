import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { ModalService } from '../../common/modal.service';
import { ModalComponent } from '../../common/modal.component';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';

import { SocketService } from '../../services/socket.service';
import { UtilityService } from '../../services/utility-service/utility.service';
@Component({
  selector: 'zone-detail',
  templateUrl: './zone-detail.component.html'
})

export class ZoneDetailComponent implements DynamicComponent {
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  entity: any;

  constructor(private router: Router,
    private appServices: AppServices,
    private notifyService: NotifyService,
    private socketService: SocketService,
    private utilityService: UtilityService) {
    this.tabReload.subscribe(data => {
      this.entity = data;
    });
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
    this.appServices._insertZone({ 'obj': JSON.stringify(data) }, this).then((__) => {
      let item = __.response.json().res;
      this.entity = item;
      this.socketService.send({
        code: "ZONE_CREATE",
        data: item
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
    this.appServices._updateZone({ 'obj': JSON.stringify(data) }, this).then((__) => {
      let item = __.response.json().res;
      this.socketService.send({
        code: "ZONE_UPDATE",
        data: item
      });
      this.notifyService.success('DONE');
    }).catch(err => {
      this.utilityService.handleError(err);
    });
  }
}
