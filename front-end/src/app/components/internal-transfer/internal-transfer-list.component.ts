import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DatePipe } from '@angular/common';

import * as $ from 'jquery';
import 'bootstrap';
import { DynamicTabItem, DynamicComponent } from '../../common/dynamic-loader/dynamic-loader.model';
@Component({
  selector: 'app-internal-transfer-list',
  templateUrl: './internal-transfer-list.component.html',
  styleUrls: ['./internal-transfer-list.component.css']
})
export class InternalTransferListComponent implements DynamicComponent {
  //#region Dynamic Component
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  //#endregion
  data_transfer; total_transfer; data_warehouse; data_owner; currentPage = 1; itemsPerPage = 12; total = 0; data_temp;
  count_transfer = 0; data_sku; data_packkey; data_rows = []; count_transferDetail; total_transferDetail;
  filter; selected_transfer; data_storer; data_location; data_pack; data_uom; data_transferDetail;
  currentPageDetail = 1; itemsPerPageDetail = 12; totalDetail = 0; data_tempDetail;
  dataToOwner = new Array(); list_dataOwner = [];
  order_ff = 'ASC';ff_loc = '';propertyName_ff;ff_storerkey = '';ff_po = '';ff_lot = '';ff_qty = '';ff_qtyAllocated = '';ff_qtyPicked = '';ff_status='';ff_lpnid='';ff_sku = '';ff_unit = ''

  constructor(private router: Router, private appServices: AppServices, private notifyService: NotifyService) { }

  ngOnInit() {
    this.data_warehouse = this.appServices.account.warehouses;
    this.data_owner = this.appServices.account.owners;
    this.loadTransferData();
  }
  loadTransferData(param?: Object) {
    let skip = (this.currentPage - 1) * this.itemsPerPage;
    let limit = Number(this.itemsPerPage);
    this.data_temp = null;
    let filter;
    if (param) {
        if(this.ff_loc.length > 0) {
            filter = $.extend(filter, {'lotxlocxid.LOC like ': this.ff_loc})
        }
        if(this.ff_storerkey.length > 0) {
            filter = $.extend(filter, {'lotxlocxid.STORERKEY like ': this.ff_storerkey})
        }
        if(this.ff_po.length > 0) {
            filter = $.extend(filter, {'receiptdetail.EXTERNRECEIPTKEY like ': this.ff_po})
        }
        if(this.ff_sku.length > 0) {
            filter = $.extend(filter, {'lotxlocxid.SKU like ': this.ff_sku})
        }
        if(this.ff_lot.length > 0) {
            filter = $.extend(filter, {'lotxlocxid.LOT like ': this.ff_lot})
        }
        if(this.ff_qty.length > 0) {
            filter = $.extend(filter, {'lotxlocxid.QTY = ': this.ff_qty})
        }
        if(this.ff_unit.length > 0) {
            filter = $.extend(filter, {'pack.PACKUOM3 like ': this.ff_unit})
        }
        if(this.ff_qtyAllocated.length > 0) {
            filter = $.extend(filter, {'lotxlocxid.QTYALLOCATED = ': this.ff_qtyAllocated})
        }
        if(this.ff_qtyPicked.length > 0) {
            filter = $.extend(filter, {'lotxlocxid.QTYPICKED = ': this.ff_qtyPicked})
        }
        if(this.ff_status.length > 0) {
            filter = $.extend(filter, {'lotxlocxid.STATUS like ': this.ff_status})
        }
        if(this.ff_lpnid.length > 0) {
            filter = $.extend(filter, {'lotxlocxid.LPNID like ': this.ff_lpnid})
        }
    }
    this.list_dataOwner = this.appServices.account.owners.map(p => p.storerkey);
    this.appServices.listInventory({ 'filter': JSON.stringify(filter), 'obj': JSON.stringify({ 'whseid': this.appServices.account.whseid, 'skip': skip, 'limit': limit, 'order': this.propertyName_ff ? this.propertyName_ff + " " + this.order_ff : null }), 'listOwner': JSON.stringify(this.list_dataOwner) }, this).then(function (obj) {
      let json = obj.response.json();
      obj.component.data_transfer = json.res;
      obj.component.total = json.total;
    }).catch(function (err) {
      err.component.notifyService.show(err.err.json().error.message, 'danger');
    })
  }
  loadOwnerFromWarehouse(value) {
    let dataToOwnerItem = new Array();
    $.each(this.data_owner, function (k, v) {
      if (v.warehousecode === value) {
        dataToOwnerItem.push(v);
      }
    });
    this.dataToOwner = dataToOwnerItem;
    this.loadLocationData(value);
    this.loadPackData(value);
    // this.loadSkuFromOwner(value);
  }
  loadSkuFromOwner(data) {
    this.appServices.listSkuByOwner({ 'whseid': this.appServices.account.whseid, 'storerkey': data, 'deleted': false, 'skip': 0 }, this).then(function (obj) {
      obj.component.data_sku = obj.response.json().res;
      if (obj.component.data_sku.length > 0)
        obj.component.loadPackkeyFromSKU(obj.component.data_sku.sku);
    }).catch(function (err) {
      err.component.notifyService.show(err.err.json().error.message, 'danger');
    });
  }
  loadPackkeyFromSKU(value) {
    if (this.data_sku.length > 0) {
      let dataToPackkey = new Array();
      $.each(this.data_sku, function (k, v) {
        if (v.sku === value) {
          dataToPackkey.push(v);
        }
      });
      this.data_packkey = dataToPackkey;
      this.loadUomFromPackkey(this.data_packkey[0].packkey);
    }
  }
  loadPackData(data) {
    this.appServices.listPack({ 'whseid': data, 'deleted': false, 'skip': 0 }, this).then(function (obj) {
      obj.component.data_pack = obj.response.json().res;
    }).catch(function (err) {
      err.component.notifyService.show(err.err.json().error.message, 'danger');
    });
  }
  loadUomFromPackkey(value) {
    let dataToUom = new Array();
    $.each(this.data_pack, function (k, v) {
      if (v.packkey === value) {
        dataToUom.push(v);
      }
    });
    this.data_uom = dataToUom;
  }
  loadLocationData(data) {
    this.appServices.listLocation({ 'whseid': data, 'deleted': false, 'skip': 0 }, this).then(function (obj) {
      obj.component.data_location = obj.response.json().res;
    }).catch(function (err) {
      err.component.notifyService.show(err.err.json().error.message, 'danger');
    });
  }
  findTransferData(data) {
    this.selected_transfer = data;
  }
  saveToTranferData(data) {
    data['username'] = this.appServices.account.username;
    data['lottable1'] = this.selected_transfer.LOTTABLE01;
    data['lottable2'] = this.selected_transfer.LOTTABLE02;
    data['lottable3'] = this.selected_transfer.LOTTABLE03;
    data['lottable4'] = this.selected_transfer.LOTTABLE04;
    data['lottable5'] = this.selected_transfer.LOTTABLE05;
    data['lottable6'] = this.selected_transfer.LOTTABLE06;
    data['lottable7'] = this.selected_transfer.LOTTABLE07;
    data['lottable8'] = this.selected_transfer.LOTTABLE08;
    data['lottable9'] = this.selected_transfer.LOTTABLE09;
    data['lottable10'] = this.selected_transfer.LOTTABLE10;
    data['lottable11'] = this.selected_transfer.LOTTABLE11;
    data['lottable12'] = this.selected_transfer.LOTTABLE12;
    data['packkey'] = this.selected_transfer.PACKKEY;
    data['deleted'] = false;
    // if ( (typeof data.toWareHouse  === 'undefined') ||(typeof data.toStorerKey === 'undefined')||(typeof data.toLocation === 'undefined')||(typeof data.toStorerKey === 'undefined')||(typeof data.toQty === 'undefined')||(typeof data.transferDate === 'undefined')||(typeof data.toUom === 'undefined')||(typeof data.toSku === 'undefined')) {
    //   this.notifyService.show('please input valid data','warning');
    //   this.loadTransferData();
    // }else {
    this.appServices.saveToTransfer({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
      let res = obj.response.res;
      obj.component.notifyService.show('Process Done');
      obj.component.loadTransferData();
    }).catch(function (err) {
      err.component.notifyService.show(err.err.json().err.message, 'danger');
    });
    // }
  }
  loadTransferDataDetail(param?: Object) {
    let skip = (this.currentPage - 1) * this.itemsPerPage;
    let limit = this.itemsPerPage;
    this.data_temp = null;
    if (param) {
      this.filter = $.extend(this.filter, param);
      let paramIndex = Object.keys(this.filter).indexOf(Object.keys(param)[0]);
      if (!(Object.values(this.filter)[paramIndex])) {
        delete this.filter[Object.keys(param)[0]];
      }
    }
    this.appServices.findTransferDetail({ 'filter': JSON.stringify({ 'where': $.extend({ 'whseid': this.appServices.account.whseid, 'deleted': false }, this.filter), 'skip': skip }) }, this)
      .then(function (obj) {
        let json = obj.response.json();
        obj.component.data_transferDetail = json.res;
        obj.component.total = json.total;
      }).catch(function (err) {
        err.component.notifyService.show(err.err.json().error.message, 'danger');
      });
  }
  ConfirmTransferData(data) {
    data['username'] = this.appServices.account.username;
    if (
      (data.towhseid === '') ||
      (data.tostorerkey === '') ||
      (data.touom === '') ||
      (data.toloc === '') ||
      (data.tosku === '') ||
      (data.toqty === '' || data.toqty <= 0) ||
      ((data.fromqty - data.toqty) < 0)
    ) {
      this.notifyService.show('please enter value', 'warning');
      this.loadTransferDataDetail();
    } else {
      this.appServices.transactionQtyTransfer({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
        let res = obj.response.res;
        obj.component.notifyService.show('Process Done');
        obj.component.loadTransferDataDetail();
      }).catch(function (err) {
        err.component.notifyService.show(err.err.json().err.message, 'danger');
      });
    }
  }
  onChoose(e, data) {
    if (e.target.checked) {
      this.data_rows.push(data);
    } else {
      const index = this.data_rows.indexOf(data);
      this.data_rows.splice(index, 1);
    }
  }
  // DeleteTransferData() {
  //   let data = this.data_rows;
  //   if (data) {
  //     data['editwho'] = this.appServices.account.username;
  //     data['deleted'] = '1';
  //     this.appServices.transactionDeleteTransfer({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
  //       let res = obj.response.json().res;
  //       obj.component.notifyService.show('Delete Done');
  //       obj.component.loadTransferDataDetail();
  //     }).catch(function (err) {
  //       err.component.notifyService.show(err.err.json().err.message, 'danger');
  //     });
  //   }
  // }

  delete() {
    this.notifyService.confirmDelete().then(()=>{
      let data = this.data_rows;
      if (data) {
        data['editwho'] = this.appServices.account.username;
        data['deleted'] = true;
        this.appServices.transactionDeleteTransfer({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
          let res = obj.response.json().res;
          obj.component.notifyService.show('Delete Done');
          obj.component.loadTransferDataDetail();
        }).catch(function (err) {
          err.component.notifyService.show(err.err.json().err.message, 'danger');
        });
      }
    });
  }
}
