import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DatePipe } from '@angular/common';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import * as $ from 'jquery';
import 'bootstrap';
import { DynamicComponent } from '../../common/dynamic-loader/dynamic-loader.model';
import { SocketService } from '../../services/socket.service';
import { UtilityService } from '../../services/utility-service/utility.service';
@Component({
  selector: 'app-bom-detail',
  templateUrl: './bom-detail.component.html'
})
export class BomDetailComponent implements OnInit, DynamicComponent {
  tabReload: EventEmitter<any> = new EventEmitter();
  data_sku: any;
  data_componentsku: any;
  entity: any;
  constructor(private router: Router,
    private appServices: AppServices,
    private notifyService: NotifyService,
    private utilityService: UtilityService,
    private datepipe: DatePipe,
    private completerService: CompleterService,
    private socketService: SocketService) {

    this.tabReload.subscribe(data => {
      if (data) this.entity = Object.assign({}, data);
      else this.entity = {};
    });
  }
  ngOnInit() {
    this.loadSkuData();
  }
  loadSkuData() {
    this.appServices.findSku({ 'filter': JSON.stringify({ 'where': { 'whseid': this.appServices.account.whseid, 'deleted': false } }) }, this)
      .then((__) => {
        this.data_sku = this.completerService.local(__.response.json().res, 'sku', 'sku');
      }).catch((err) => {
        this.utilityService.handleError(err);
      })
  }
  changeProduct(e) {
    if (typeof e == 'object' && e != null) {
      let temp = this.data_sku._data.filter((value) => { return value.sku !== e.originalObject.sku; });
      this.data_componentsku = this.completerService.local(temp, 'sku', 'sku');
    } else if (e != null) {
      let temp = this.data_sku._data.filter((value) => { return value.sku !== e; });
      this.data_componentsku = this.completerService.local(temp, 'sku', 'sku');
    }
  }

  save() {
    if (this.entity.addwho) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert() {
    if (this.entity.sku == this.entity.componentsku) {
      this.notifyService.show('Please select onother sku with componentsku !', 'warning');
    } else {
      this.entity['whseid'] = this.appServices.account.whseid;
      this.entity['currentuser'] = this.appServices.account.username;
      this.appServices.insertBom({ 'obj': JSON.stringify(this.entity) }, this)
        .then(__ => {
          this.notifyService.success('Process Done');
          this.entity = __.response.json().res;
          this.socketService.send({
            code: "BOM_CREATE",
            data: this.entity
          });
        }).catch((err) => {
          this.utilityService.handleError(err);
        })
    }
  }
  update() {
    this.entity['whseid'] = this.appServices.account.whseid;
    this.entity['deleted'] = false;
    this.entity['currentuser'] = this.appServices.account.username;
    this.appServices.updateBom({ 'obj': JSON.stringify(this.entity) }, this)
      .then(__ => {
        this.notifyService.success('Process Done');
        this.entity = __.response.json().res;
        this.socketService.send({
          code: "BOM_UPDATE",
          data: this.entity
        });
      }).catch((err) => {
        this.utilityService.handleError(err);
      })
  }
}
