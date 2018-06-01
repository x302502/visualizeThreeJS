import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { PasteService } from './../../paste.service';
import { DatePipe } from '@angular/common';
import { ModalService } from '../../common/modal.service';
import { ModalComponent } from '../../common/modal.component';
import { CompleterService, CompleterData } from 'ng2-completer';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';

import * as $ from 'jquery';
import 'bootstrap';
import { SocketService } from '../../services/socket.service';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { GridOption } from '../../common/grid-control/grid-control';
import { UtilityService } from '../../services/utility-service/utility.service';

@Component({
  selector: 'allocatemanual',
  templateUrl: './allocatemanual.component.html'
})

export class AllocatemanualComponent implements OnInit, DynamicComponent {
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();

  @ViewChild('grid') grid: GridControlComponent;
  gridOption: GridOption;
  entity: any = {};
  listmanual;
  listReceiptDetail;
  datamanual;
  dataPack;
  dataOrder;
  data_row = [];
  total_gridmanual = 0; itemsPerPage_gridmanual = 12; currentPage_gridmanual = 1;
  constructor(private router: Router,
    private appServices: AppServices,
    private notifyService: NotifyService,
    private socketService: SocketService,
    private utilityService: UtilityService) {
    this.tabReload.subscribe(data => {
      this.entity = data;
      this.loadPack().then(() => {
        this.loadForm();
      });
    });
  }

  ngOnInit() {
    this.loaddetail();
    this.loadAllocatemanual();
  }

  loadPack() {
    return new Promise((resolve, reject) => {
      let data = {};
      data['whseid'] = this.appServices.account.whseid;
      data['delete'] = false;
      this.appServices.findPack({ 'filter': JSON.stringify(data) }, this)
        .then((__) => {
          this.dataPack = __.response.json().res;
          resolve();
        }).catch((err) => {
          this.notifyService.error(err);
          reject(err);
        })
    });
  }

  loaddetail() {
    this.appServices.listOrdersDetail({ 'whseid': this.appServices.account.whseid, 'orderkey': this.entity.orderkey, 'deleted': false }, this)
      .then((__) => {
        this.listReceiptDetail = __.response.json().res;
      }).catch((err) => {
        this.notifyService.error(err);
      })
  }

  loadForm() {
    let data;
    let openqty;
    let originalqty;
    let qtyallocated;
    let qtypicked;
    let shippedqty;
    let pack;

    this.dataPack.forEach((valuepack, indexpack, arrpack) => {
      if (this.entity.packkey == valuepack.packkey) {
        pack = valuepack;
      }
    })
    if (this.entity.uom == pack.packuom2) {
      if (pack.innerpack == 0 || pack.packuom2 == "") {
        openqty = this.entity.openqty * 1;
        originalqty = this.entity.originalqty * 1;
        qtyallocated = this.entity.qtyallocated * 1;
        qtypicked = this.entity.qtypicked * 1;
        shippedqty = this.entity.shippedqty * 1
      }
      openqty = this.entity.openqty * pack.innerpack;
      originalqty = this.entity.originalqty * pack.innerpack;
      qtyallocated = this.entity.qtyallocated * pack.innerpack;
      qtypicked = this.entity.qtypicked * pack.innerpack;
      shippedqty = this.entity.shippedqty * pack.innerpack;
    }
    if (this.entity.uom == pack.packuom3) {
      openqty = this.entity.openqty * pack.qty;
      originalqty = this.entity.originalqty * pack.qty;
      qtyallocated = this.entity.qtyallocated * pack.qty;
      qtypicked = this.entity.qtypicked * pack.qty;
      shippedqty = this.entity.shippedqty * pack.qty;
    }
    if (this.entity.uom == pack.packuom4) {
      openqty = this.entity.openqty * pack.pallet;
      originalqty = this.entity.originalqty * pack.pallet;
      qtyallocated = this.entity.qtyallocated * pack.pallet;
      qtypicked = this.entity.qtypicked * pack.pallet;
      shippedqty = this.entity.shippedqty * pack.pallet;
    }
    this.entity.openqty = openqty;
    this.entity.originalqty = originalqty;
    this.entity.qtyallocated = qtyallocated;
    this.entity.qtypicked = qtypicked;
    this.entity.shippedqty = shippedqty;
    if (this.entity.originalqty - (this.entity.qtyallocated + this.entity.qtypicked + this.entity.shippedqty) <= 0) {
      this.entity['unallocate'] = 0
    } else this.entity['unallocate'] = this.entity.originalqty - (this.entity.qtyallocated + this.entity.qtypicked + this.entity.shippedqty)
  }

  loadAllocatemanual() {
    let data = this.entity;
    let skip = (this.currentPage_gridmanual - 1) * this.itemsPerPage_gridmanual;
    let limit = this.itemsPerPage_gridmanual;
    this.appServices.getListAllocatemanual({ 'obj': JSON.stringify(data) }, this)
      .then((__) => {
        this.listmanual = __.response.json().res;
        this.listmanual['giveqty'] = 0;
        this.total_gridmanual = __.response.json().total
      }).catch((err) => {
        this.utilityService.handleError(err);
      })
  }

  changeLine(orderlinenumber) {
    let data = {};
    let promises = [];
    data['whseid'] = this.appServices.account.whseid;
    data['orderkey'] = this.entity.orderkey;
    data['orderlinenumber'] = orderlinenumber;
    data['deleted'] = false;
    promises.push(new Promise((resolve, reject) => {
      this.appServices.findOneOrderdetail({ 'obj': JSON.stringify(data) }, this).then((__) => {
        this.entity = __.response.json().res;
        this.entity['unallocate'] = this.entity.originalqty - (this.entity.qtyallocated + this.entity.qtypicked + this.entity.shippedqty)
        resolve();
      }).catch(function (err) {
        reject(err);
      });
    }));
    Promise.all(promises).then(() => {
      this.loadAllocatemanual();
    }).catch(err => {
      this.utilityService.handleError(err);
    })
  }

  onChoose(e, data) {
    if (e.target.checked) {
      if (this.entity.unallocate >= data.qtyavliable) {
        this.entity.unallocate = this.entity.unallocate - data.qtyavliable;
        data.giveqty = data.qtyavliable;
        data.qtyavliable = 0;
      } else {
        data.qtyavliable = data.qtyavliable - this.entity.unallocate;
        data.giveqty = this.entity.unallocate;
        this.entity.unallocate = 0;
      }
      this.data_row.push(data);
    } else {
      if (data.qtyavliable >= this.entity.unallocate) {
        this.entity.unallocate = this.entity.unallocate + data.giveqty;
        data.qtyavliable = data.qtyavliable + data.giveqty;
        data.giveqty = 0;
      } else {
        this.entity.unallocate = this.entity.unallocate + data.giveqty;
        data.qtyavliable = data.qtyavliable + data.giveqty;
        data.giveqty = 0;
      }
      let index = this.data_row.indexOf(data);
      this.data_row.splice(index, 1);
    }

  }

  save() {
    this.entity['addwho'] = this.appServices.account.username;
    this.appServices.allocatemanual({ 'objOrder': JSON.stringify(this.entity), 'objLotxlocxid': JSON.stringify(this.data_row) }, this).then((obj) => {
      this.notifyService.success('Done');
      this.loaddetail();
      this.loadAllocatemanual();
      this.socketService.send({
        code: "ORDER_UPDATE",
        data: {}
      });
    }).catch(err => {
      this.utilityService.handleError(err);
    });
  }
}
