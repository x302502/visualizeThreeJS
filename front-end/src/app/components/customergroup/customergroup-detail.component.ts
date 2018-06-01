import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';

import { CustomergroupListComponent } from './customergroup-list.component';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'customergroup-detail',
  templateUrl: './customergroup-detail.component.html'
})

export class CustomergroupDetailComponent implements OnInit, DynamicComponent {
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  selected_customergroup;

  constructor(private router: Router,
    private appServices: AppServices,
    private notifyService: NotifyService,
    private socketService: SocketService) {
    this.tabReload.subscribe(data => {
      this.selected_customergroup = data;
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
      this.appServices._insertCustomergroup({'obj': JSON.stringify(data)}, this).then((__)=>{
        this.selected_customergroup = __.response.json().res;
        this.socketService.send({
          code: "CUSTOMERGROUP_CREATE",
          data: this.selected_customergroup
        });
        this.notifyService.success('Process Done');
      }).catch((err)=>{
        this.notifyService.error(err.err.json().error.message);
      })
  }

  update(data) {
      data['whseid'] = this.appServices.account.whseid;
      data['deleted'] = false;
      data['currentuser'] = this.appServices.account.username;
      this.appServices._updateCustomergroup({'obj': JSON.stringify(data)}, this).then((__)=>{
        this.selected_customergroup = __.response.json().res;
        this.socketService.send({
          code: "CUSTOMERGROUP_UPDATE",
          data: this.selected_customergroup
        });
        this.notifyService.success('Process Done');
      }).catch((err)=>{
        this.notifyService.error(err.err.json().error.message);
      })
  }

  redirectToCustomergroupList() {
    let dynamicTabItem: DynamicTabItem = {
      title: 'Customergroup List',
      component: CustomergroupListComponent,
      data: null
    }
    this.tabEmitter.emit(dynamicTabItem);
  }

}
