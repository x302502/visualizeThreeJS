import { Component, OnInit, EventEmitter } from '@angular/core';

import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';

import * as $ from 'jquery';
import 'bootstrap';
import { DynamicTabItem, DynamicComponent } from '../../common/dynamic-loader/dynamic-loader.model';


@Component({
  selector: 'app-adjustment-list',
  templateUrl: './adjustment-list.component.html',
  styleUrls: ['./adjustment-list.component.css']
})
export class AdjustmentListComponent implements DynamicComponent {
  //#region Dynamic Component
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  //#endregion
  filter;currentPage = 1; itemsPerPage = 12; total = 0; data_temp;
  data_adjustment; count_adjustment = 0;
  total_adjustment; qty_atfer_adjust; data_codelkup;
  adjust_qty = 0; reason_adjust = '';
  data_rows = [];list_dataOwner = [];
  order_ff = 'ASC';ff_loc = '';propertyName_ff;ff_storerkey = '';ff_po = '';ff_lot = '';ff_qty = '';ff_qtyAllocated = '';ff_qtyPicked = '';ff_status='';ff_lpnid='';ff_sku = '';ff_unit = ''
  
  constructor(private appServices: AppServices, private notifyService: NotifyService) { }
  
  ngOnInit() {
    this.loadAdjustmentData();
    this.loadCodelkupData();
  }
  loadAdjustmentData(param?: Object) {
    let skip = (this.currentPage-1)*this.itemsPerPage;
    let limit =  Number(this.itemsPerPage);
    this.data_temp = null;
    let filter;
    let n ;
    if (param) {
      if(this.ff_loc.length > 0) {
          filter = $.extend(filter, {'lotxlocxid.LOC like ': '%'+ this.ff_loc + '%'})
      }
      if(this.ff_storerkey.length > 0) {
          filter = $.extend(filter, {'lotxlocxid.STORERKEY like ': '%'+ this.ff_storerkey + '%'})
      }
      if(this.ff_po.length > 0) {
          filter = $.extend(filter, {'receipt.EXTERNRECEIPTKEY like ': '%'+ this.ff_po + '%'})
      }
      if(this.ff_sku.length > 0) {
          filter = $.extend(filter, {'lotxlocxid.SKU like ': '%'+ this.ff_sku + '%'})
      }
      if(this.ff_lot.length > 0) {
          filter = $.extend(filter, {'lotxlocxid.LOT like ': '%'+ this.ff_lot + '%'})
      }
      if(this.ff_qty) {
        n = this.ff_qty.search(">") && this.ff_qty.search(">=") && this.ff_qty.search("<") && this.ff_qty.search("<=");
        if( n == -1) {
            filter = $.extend(filter, {'lotxlocxid.QTY = ': this.ff_qty})
        } else {
            filter = $.extend(filter, {'lotxlocxid.QTY ': this.ff_qty})
        }
      }
      if(this.ff_unit.length > 0) {
          filter = $.extend(filter, {'pack.PACKUOM3 like ': '%'+ this.ff_unit + '%' })
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
          filter = $.extend(filter, {'lotxlocxid.LPNID like ': '%'+ this.ff_lpnid + '%'})
      }
  }
  this.list_dataOwner = this.appServices.account.owners.map(p => p.storerkey);
  this.appServices.listInventory({ 'filter': JSON.stringify(filter), 'obj': JSON.stringify({'whseid': this.appServices.account.whseid, 'skip': skip, 'limit': limit, 'order': this.propertyName_ff ? this.propertyName_ff + " " + this.order_ff : null}), 'listOwner':JSON.stringify(this.list_dataOwner) }, this).then((obj)=>{
      let json = obj.response.json().res;
      this.data_adjustment = json.res;
      this.total = json.count;
      this.notifyService.show('There are ' + json.count + ' rows in database');
    }).catch(function(err){
      err.component.notifyService.show(err.err.json().error.message, 'danger');
    })
  }
  loadCodelkupData(param?: Object, skip = 0) {
    this.appServices.findCodelkup({
      'filter': JSON.stringify({
        'where': $.extend({
          'whseid': this.appServices.account.whseid,
          'listname': 'ADJREASON',
          'deleted': false,
          'skip': 0 
        }, this.filter),'skip': skip})}, this).then((obj)=> {
      this.data_codelkup = obj.response.json().res;
    }).catch(function (err) {
      err.component.notifyService.show(err.err.json().error.message, 'danger');
    });
  }
  validQty(event) {
    var keycode = event.charCode || event.keyCode;
    if (keycode == 46) {
        return false;
    }
}
  updateAdjustmentData(data) {
    let adjust_qty = 0;
    if(data.adjust_qty_pcs ) {
      data['adjust_qty'] = data.adjust_qty_pcs;
    }
    if(data.adjust_qty_case) {
      data['adjust_qty'] = data.adjust_qty_case* data.INNERPACK;
    }
    data['whseid'] = this.appServices.account.whseid;
    data['storerkey'] = data.STORERKEY;
    data['lpnid'] = data.LPNID;
    data['sku'] = data.SKU;
    data['lot'] = data.LOT;
    data['status'] = data.STATUS;
    data['loc'] = data.LOC;
    // data['adjust_qty'] = data.adjust_qty;
    data['reasoncode'] = data.code;
    data['uom'] = data.PACKUOM3;
    data['packkey'] = data.PACKKEY;
    data['casecnt'] = data.CASECNT;
    data['innerpack'] = data.INNERPACK;
    data['pallet'] = data.PALLET;
    data['cube'] = data.STDCUBE;
    data['grosswgt'] = data.STDGROSSWGT;
    data['netwgt'] = data.STDNETWGT;
    data['receiptkey'] = data.RECEIPTKEY;
    data['receiptlinenumber'] = data.RECEIPTLINENUMBER;
    data['username'] = this.appServices.account.username;
    data['unitid'] = data.UNITID;
    data['cartonid'] = data.CARTONID;
    data['palletid'] = data.PALLETID;
    // data['description'] = data.description;
    if (typeof data.adjust_qty === 'undefined'){
      this.notifyService.warning('Please enter value in QTY-PCS_ADJUST or QTY-CASE_ADJUST ');
      this.loadAdjustmentData();
    } else if (data.adjust_qty === 0) {
      this.notifyService.warning(' Value in QTY-PCS_ADJUST or QTY-CASE_ADJUST cannot be equal 0 ');
      this.loadAdjustmentData();
    } else if ((data.QTY + data.adjust_qty) < 0) {
      this.notifyService.warning(' Value QTY_ADJUST cannot be great than QTY ');
      this.loadAdjustmentData();
    } else if(typeof data.code === 'undefined') {
      this.notifyService.warning(' REASON_ADUJUST CAN NOT BE EMPTY ');
      this.loadAdjustmentData();
    } else if(data.adjust_qty_pcs && data.adjust_qty_case){
      this.notifyService.warning(' CAN FILL QTY-PCS_ADJUST or QTY-CASE_ADJUST , NOT BOTH');
      this.loadAdjustmentData();
    } else if(data.QTYALLOCATED != 0 || data.QTYPICKED != 0){
      this.notifyService.warning(' HAVE QTYALLOCATED OR QTYPICKED');
      this.loadAdjustmentData();
    }
    else {
      this.appServices.transactionQty({ 'obj': JSON.stringify(data) }, this).then((obj)=> {
        const res = obj.response.res;
        this.notifyService.show('Process Done');
        this.loadAdjustmentData();
      }).catch(function (err) {
        err.component.notifyService.show(err.err.json().err.message, 'danger');
      });
    }
  }
  onChoose(e, data) {
    if (e.target.checked) {
      this.data_rows.push(data);
    }else {
      let index = this.data_rows.indexOf(data);
      this.data_rows.splice(index, 1);
    }
  }
  checkAll(e) {
    if(e.target.checked){
      this.data_rows = new Array();
      this.data_adjustment.forEach(curr_data=>{
        curr_data.state = e.target.checked;
        this.data_rows.push(curr_data);
      })
    } else {
      this.data_adjustment.forEach(x=>x.state = e.target.checked);
      this.data_rows = [];
    }
    
  }
  isAllChecked(){
    if (this.data_adjustment) {
      return this.data_adjustment.every(_ => _.state);
    }
  }
}
