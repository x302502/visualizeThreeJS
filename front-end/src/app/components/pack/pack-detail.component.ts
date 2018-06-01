import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';

import { PackListComponent } from './pack-list.component';
import { SocketService } from '../../services/socket.service';
import { UtilityService } from '../../services/utility-service/utility.service';

@Component({
  selector: 'pack-detail',
  templateUrl: './pack-detail.component.html'
})

export class PackDetailComponent implements OnInit, DynamicComponent {
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  selected_pack;
  data_codelkup = [];

  constructor(private appServices: AppServices,
    private utilityService: UtilityService,
    private notifyService: NotifyService,
    private socketService: SocketService) {
    this.tabReload.subscribe(data => {
      this.selected_pack = data;
    });
  }

  ngOnInit() {
    this.loadCodelkupData() ;
  }

  loadCodelkupData() {
    this.appServices.findCodelkup({'filter': JSON.stringify({'where': {'whseid':this.appServices.account.whseid,'listname':"QUANTITY",'deleted': false}})}, this).then((__)=>{
      this.data_codelkup = __.response.json().res;
    }).catch((err)=>{
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

  insert(data){
      data['whseid'] = this.appServices.account.whseid;
      data['currentuser'] = this.appServices.account.username;
      this.appServices._insertPack({'obj': JSON.stringify(data)}, this).then((__)=>{
        this.selected_pack = __.response.json().res;
        this.socketService.send({
          code: "PACK_CREATE",
          data: this.selected_pack
        });
        this.notifyService.success('Process Done');
      }).catch(err=>{
        this.notifyService.error(err.err.json().error.message);
      })
  }

  update(data){
      data['whseid'] = this.appServices.account.whseid;
      data['deleted'] = false;
      data['currentuser'] = this.appServices.account.username;
      this.appServices._updatePack({'obj': JSON.stringify(data)}, this).then((__)=>{
        this.selected_pack = __.response.json().res;
        this.socketService.send({
          code: "PACK_UPDATE",
          data: this.selected_pack
        });
        this.notifyService.success('Process Done');
      }).catch((err)=>{
        this.utilityService.handleError(err);
      })
  }
}
