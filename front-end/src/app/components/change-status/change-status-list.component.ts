import { Component, OnInit, EventEmitter } from '@angular/core';
import * as $ from 'jquery';
import 'bootstrap';

import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DynamicTabItem, DynamicComponent } from '../../common/dynamic-loader/dynamic-loader.model';

@Component({
  selector: 'app-change-status-list',
  templateUrl: './change-status-list.component.html',
  styleUrls: ['./change-status-list.component.css']
})
export class ChangeStatusListComponent implements DynamicComponent {
  //#region Dynamic Component
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  //#endregion
  data_status; filter; selected_status;currentPage = 1; itemsPerPage = 12; total = 0; data_temp;
  count_status = 0;
  total_status;
  adjust_qty = 0; reason_adjust = ''; data_codelkup ; data_rows = [];list_dataOwner = [];
  order_ff = 'ASC';ff_loc = '';propertyName_ff;ff_storerkey = '';ff_po = '';ff_lot = '';ff_qty = '';ff_qtyAllocated = '';ff_qtyPicked = '';ff_status='';ff_lpnid='';ff_sku = '';ff_unit = ''

  constructor(private appServices: AppServices, private notifyService: NotifyService) { }
  
  ngOnInit() {
    this.loadChangeStatusData();
    this.loadCodelkupData();
  }
  loadChangeStatusData(param?: Object) {
    let skip = (this.currentPage-1)*this.itemsPerPage;
    let limit =  Number(this.itemsPerPage);
    this.data_temp = null;
    let filter;
    let n;
    if (param) {
      if(this.ff_loc.length > 0) {
          filter = $.extend(filter, {'lotxlocxid.LOC like ': '%'+ this.ff_loc + '%'})
      }
      if(this.ff_storerkey.length > 0) {
          filter = $.extend(filter, {'lotxlocxid.STORERKEY like ': '%'+ this.ff_storerkey + '%'})
      }
      if(this.ff_po.length > 0) {
          filter = $.extend(filter, {'receiptdetail.EXTERNRECEIPTKEY like ': '%'+ this.ff_po + '%'})
      }
      if(this.ff_sku.length > 0) {
          filter = $.extend(filter, {'lotxlocxid.SKU like ': '%'+ this.ff_sku + '%'})
      }
      if(this.ff_lot.length > 0) {
          filter = $.extend(filter, {'lotxlocxid.LOT like ': '%'+ this.ff_lot + '%'})
      }
      if(this.ff_qty.length > 0) {
        n = this.ff_qty.search(">") && this.ff_qty.search(">=") && this.ff_qty.search("<") && this.ff_qty.search("<=");
        if( n == -1) {
            filter = $.extend(filter, {'lotxlocxid.QTY = ': this.ff_qty})
        } else {
            filter = $.extend(filter, {'lotxlocxid.QTY ' : this.ff_qty})
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
          filter = $.extend(filter, {'lotxlocxid.STATUS like ': '%'+ this.ff_status + '%'})
      }
      if(this.ff_lpnid.length > 0) {
          filter = $.extend(filter, {'lotxlocxid.LPNID like ': '%'+ this.ff_lpnid +'%' })
      }
      
      
  
    }
    this.list_dataOwner = this.appServices.account.owners.map(p => p.storerkey);
    this.appServices.listInventory({ 'filter': JSON.stringify(filter), 'obj': JSON.stringify({'whseid': this.appServices.account.whseid, 'skip': skip, 'limit': limit, 'order': this.propertyName_ff ? this.propertyName_ff + " " + this.order_ff : null}), 'listOwner':JSON.stringify(this.list_dataOwner) }, this).then((obj)=>{
      let json = obj.response.json().res;
      this.data_status = json.res;
      console.log(this.data_status);
      
      this.total = json.total;
    }).catch(function(err){
      err.component.notifyService.show(err.err.json().error.message, 'danger');
    })
  }
  loadCodelkupData(param?: Object, skip = 0) {
    this.appServices.findCodelkup({
      'filter': JSON.stringify({
        'where': $.extend({
          'whseid': this.appServices.account.whseid,
          'listname': 'RECHOLD',
          'deleted': false,
          'skip': 0 
        }, this.filter),'skip': skip})}, this).then(function (obj) {
      obj.component.data_codelkup = obj.response.json().res;
    }).catch(function (err) {
      err.component.notifyService.show(err.err.json().error.message, 'danger');
    });
  }
  updateChangeStatusData(data) {
    data['whseid'] = this.appServices.account.whseid;
    data['storerkey'] = data.STORERKEY;
    data['lpnid'] = data.LPNID;
    data['sku'] = data.SKU;
    data['lot'] = data.LOT;
    data['status'] = data.STATUS;
    data['code'] = data.code;
    data['loc'] = data.LOC;
    data['qty'] = data.QTY;
    data['uom'] = data.PACKUOM3;
    data['uomqty'] = data.UOMQTY;
    data['packkey'] = data.PACKKEY;
    data['casecnt'] = data.CASECNT;
    data['innerpack'] = data.INNERPACK;
    data['pallet'] = data.PALLET;
    // data['description'] = data.
    data['cube'] = data.STDCUBE;
    data['grosswgt'] = data.STDGROSSWGT;
    data['netwgt'] = data.STDNETWGT;
    data['receiptkey'] = data.RECEIPTKEY;
    data['receiptlinenumber'] = data.RECEIPTLINENUMBER;
    data['username'] = this.appServices.account.username;
    data['lpnid'] = data.LPNID;
    if ((typeof data.code === 'undefined') || data.STATUS.trim() === data.code.trim() ) {
      this.notifyService.warning('PLEASE CHOOSE STATUS');
      this.loadChangeStatusData();
    }
    else if(data.QTYALLOCATED != 0 || data.QTYPICKED != 0){
      this.notifyService.warning('HAVE QTYALLOCATED OR QTYPICKED, CANNOT MOVE');
      this.loadChangeStatusData();
    }
    else {
      this.appServices.transactionChangeStatus({ 'obj': JSON.stringify(data) }, this).then((obj)=> {
        let  res = obj.response.res;
        this.notifyService.show('Process Done');
        this.loadChangeStatusData();
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
      this.data_status.forEach(curr_data=>{
        curr_data.state = e.target.checked;
        this.data_rows.push(curr_data);
      })
    } else {
      this.data_status.forEach(x=>x.state = e.target.checked);
      this.data_rows = [];
    }
    
  }
  isAllChecked(){
    if (this.data_status >0) {
      return this.data_status.every(_ => _.state);
    }
  }
}
