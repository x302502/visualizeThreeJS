import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import * as $ from 'jquery';
import 'bootstrap';
import { GridOption } from '../../common/grid-control/grid-control';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { SocketService, ISocketData } from '../../services/socket.service';
import { BomDetailComponent } from './bom-detail.component';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { UtilityService } from '../../services/utility-service/utility.service';
@Component({
  selector: 'app-bom-list',
  templateUrl: './bom-list.component.html'
})
export class BomListComponent implements OnInit, DynamicComponent {
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  @ViewChild('grid') grid: GridControlComponent;
  gridOption: GridOption;

  socketSubcription: any;
  constructor(private router: Router,
    private appServices: AppServices,
    private notifyService: NotifyService,
    private socketService: SocketService,
    private utilityService: UtilityService) {
  }
  ngOnInit() {
    this.listenSocket();
    this.initGrid();
  }

  ngOnDestroy() {
    if (this.socketSubcription) this.socketSubcription.unsubscribe();
  }

  listenSocket() {
    this.socketSubcription = this.socketService.emitter.subscribe((socketData: ISocketData) => {
      if (socketData.code === "BOM_CREATE" || socketData.code === "BOM_UPDATE" || socketData.code === "BOM_DELETE") {
        this.grid.reload();
      }
    });
  }

  initGrid() {
    this.gridOption = new GridOption();
    this.gridOption.component = this;
    this.gridOption.key = 'BomListComponent';
    this.gridOption.url = '/api/billofmaterials/find';
    this.gridOption.customFilter = {
      'whseid': this.appServices.account.whseid,
      'deleted': false,
      'storerkey': { inq: this.appServices.account.strOwners }
    };
    this.gridOption.commands = [{
      icon: 'fa fa-edit text-primary',
      click: this.detail
    }, {
      icon: 'fa fa-trash text-danger',
      click: this.delete
    }];
    this.gridOption.columns = [{
      field: 'storerkey',
      title: 'Owner',
      type: 'string'
    }, {
      field: 'componentsku',
      title: 'Product',
      type: 'string',
      width: '200px'
    }, {
      field: 'sku',
      title: 'Material',
      type: 'string',
      width: '200px'
    }, {
      field: 'sequence',
      title: 'Sequence',
      type: 'number',
      width: '100px'
    }, {
      field: 'qty',
      title: 'Quantity',
      type: 'number',
      width: '100px'
    }];
  }

  importExcel(records: any[]) {
    let promises = [];
    records.forEach((record, index) => {
      let promise = new Promise((resolve, reject) => {
        record['whseid'] = this.appServices.account.whseid;
        record['currentuser'] = this.appServices.account.username;
        record['deleted'] = false;
        this.appServices.saveBom({ 'obj': JSON.stringify(record) }, this).then((__) => {
          resolve();
        }).catch((err) => {
          this.notifyService.error('Error at: ' + (index + 1));
          resolve();
        });
      });
      promises.push(promise);
    });
    Promise.all(promises).then(() => {
      this.socketService.send({
        code: 'BOM_CREATE',
        data: null
      });
      this.notifyService.success('Process Done');
      this.grid.reload();
    });
  }

  detail = (data?: any) => {
    let dynamicTabItem: DynamicTabItem = {
      title: 'Bom Detail',
      component: BomDetailComponent,
      data: data
    }
    this.tabEmitter.emit(dynamicTabItem);
  }
  delete(data) {
    this.notifyService.confirmDelete(data.sku).then(() => {
      data['deleted'] = true;
      data['currentuser'] = this.appServices.account.username;
      this.appServices.updateBom({ 'obj': JSON.stringify(data) }, this).then((__) => {
        this.notifyService.success('Process Done');
        this.socketService.send({
          code: "BOM_DELETE",
          data: null
        });
        this.grid.reload();
      }).catch((err) => {
        this.utilityService.handleError(err);
      })
    });
  }
}