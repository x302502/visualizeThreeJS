import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';

import { LineListComponent } from './line-list.component';
import { SocketService } from '../../services/socket.service';
import { UtilityService } from '../../services/utility-service/utility.service';

@Component({
  selector: 'line-detail',
  templateUrl: './line-detail.component.html'
})

export class LineDetailComponent implements OnInit, DynamicComponent {
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  entity: any;

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
    this.appServices._insertLine({ 'obj': JSON.stringify(data) }, this).then((__) => {
      this.entity = __.response.json().res;
      this.socketService.send({
        code: "LINE_CREATE",
        data: this.entity
      });
      this.notifyService.success('Process Done');
    }).catch((err) => {
      this.utilityService.handleError(err);
    });

  }

  update(data) {
    data['whseid'] = this.appServices.account.whseid;
    data['deleted'] = false;
    data['currentuser'] = this.appServices.account.username;
    this.appServices._updateLine({ 'obj': JSON.stringify(data) }, this).then((__) => {

      this.entity = __.response.json().res;
      this.socketService.send({
        code: "LINE_UPDATE",
        data: this.entity
      });
      this.notifyService.success('Process Done');
    }).catch((err) => {
      this.utilityService.handleError(err);
    });
  }
}
