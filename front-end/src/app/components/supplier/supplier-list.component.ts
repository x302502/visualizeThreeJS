import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { SupplierDetailComponent } from './supplier-detail.component';

import { GridOption } from '../../common/grid-control/grid-control';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { SocketService, ISocketData } from '../../services/socket.service';

@Component({
  selector: 'supplier-list',
  templateUrl: './supplier-list.component.html',
})
export class SupplierListComponent implements OnInit, DynamicComponent {
  //#region Dynamic Component
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  //#endregion

  @ViewChild('grid') grid: GridControlComponent;
  gridOption: GridOption;

  // Subcription
  socketSubcription: any;
  constructor(private appServices: AppServices,
    private notifyService: NotifyService,
    private socketService: SocketService) {
  }

  ngOnInit() {
    this.socketSubcription = this.socketService.emitter.subscribe((socketData: ISocketData) => {
      if (socketData.code === "SUPPLIER_CREATE" || socketData.code === "SUPPLIER_UPDATE" || socketData.code === "SUPPLIER_DELETE") {
        this.grid.reload();
      }
    });
    this.initGrid();
  }

  ngOnDestroy() {
    this.socketSubcription.unsubscribe()
  }

  initGrid() {
    this.gridOption = new GridOption();
    this.gridOption.component = this;
    this.gridOption.key = 'SupplierListComponent';
    this.gridOption.url = '/api/Storers/find';
    this.gridOption.customFilter = { 'whseid': this.appServices.account.whseid, 'type': '5', 'deleted': false };
    // this.gridOption.checkable = true;
    this.gridOption.commands = [{
      icon: 'fa fa-edit text-primary',
      click: this.edit
    }, {
      icon: 'fa fa-trash text-danger',
      click: this.delete
    }];
    this.gridOption.columns = [{
      field: 'storerkey',
      title: 'Code',
      type: 'string',
      width: '200px'
    }, {
      field: 'company',
      title: 'Name',
      type: 'string',
      width: ''
    }];
  }

  importExcel(records: any[]) {
    let promises = [];
    records.forEach((record, index) => {
      let promise = new Promise((resolve, reject) => {
        record['type'] = "5";
        record['whseid'] = this.appServices.account.whseid;
        record['currentuser'] = this.appServices.account.username;
        this.appServices._saveStorer({ 'obj': JSON.stringify(record) }, this).then((__) => {
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
        code: 'SUPPLIER_CREATE',
        data: null
      });
      this.notifyService.success('Process Done');
      this.grid.reload();
    });
  }

  create() {
    let dynamicTabItem: DynamicTabItem = {
      title: 'Supplier Detail',
      component: SupplierDetailComponent,
      data: {}
    }
    this.tabEmitter.emit(dynamicTabItem);
  }

  edit = (data) => {
    let dynamicTabItem: DynamicTabItem = {
      title: 'Supplier Detail',
      component: SupplierDetailComponent,
      data: Object.assign({}, data)
    }
    this.tabEmitter.emit(dynamicTabItem);
  }

  delete = (data) => {
    this.notifyService.confirm(`Do you want to delete <strong class="text-warning">${data.storerkey}</strong>`).then(() => {
      data['deleted'] = true;
      data['currentuser'] = this.appServices.account.username;
      this.appServices._updateStorer({ 'obj': JSON.stringify(data) }, this).then((__) => {
        this.notifyService.success('Process Done');
        this.socketService.send({
          code: "supplier_DELETE",
          data: null
        });
        this.grid.reload();
      }).catch((err) => {
        this.notifyService.error(err.err.json().error.message);
      })
    });
  }
}
