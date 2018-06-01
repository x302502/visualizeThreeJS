import { Component, OnInit, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { PasteService } from './../../paste.service';
import { DatePipe } from '@angular/common';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
// declare var $:any;
declare var Waypoint: any;
declare var document: any;
import * as $ from 'jquery';
import 'bootstrap';
import { AuthService } from '../../services/auth-service/auth.service';
import { DynamicTabItem, DynamicComponent } from '../../common/dynamic-loader/dynamic-loader.model';
import { UtilityService } from '../../services/utility-service/utility.service';

@Component({
  selector: 'app-lot-update',
  templateUrl: './lot-update.component.html',
  styleUrls: ['./lot-update.component.css']
})
export class LotUpdateComponent implements DynamicComponent {
  //#region Dynamic Component
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  //#endregion
  filter; data_lotUpdate = new Array(); state: any; selected_lotUpdate; currentPage = 1; itemsPerPage = 12; total = 0; data_temp;
  @ViewChild('tabDetail') el: ElementRef;
  count_lotUpdate = 0; data_lotUpdateDetail = new Array();
  total_lotUpdate; data_rows = new Array(); total_detail = 0; currentPage_Detail = 1; itemsPerPage_Detail = 12;
  count_lotUpdateDetail = 0; total_lotUpdateDetail; list_dataOwner = [];
  order_ff = 'ASC'; ff_loc = ''; propertyName_ff; ff_storerkey = ''; ff_po = ''; ff_lot = ''; ff_qty = ''; ff_qtyAllocated = ''; ff_qtyPicked = ''; ff_status = ''; ff_lpnid = ''; ff_sku = ''; ff_unit = ''
  ff_packkey = ''; ff_uom = ''; ff_cartonid = ''; ff_palletid = ''; data_lotUpdate_detail_valid = new Array();
  constructor(private datePipe: DatePipe,
    private utilityService: UtilityService,
    private authService: AuthService,
    private appServices: AppServices,
    private notifyService: NotifyService,
    private pasteService: PasteService) { }

  ngOnInit() {
    this.loadLotUpdateData();
  }
  loadLotUpdateData(param?) {

    let skip = (this.currentPage - 1) * this.itemsPerPage;
    let limit = Number(this.itemsPerPage);
    this.data_temp = null;
    let filter;
    let n;
    if (param) {
      if (this.ff_loc.length > 0) {
        filter = $.extend(filter, { 'lotxlocxid.LOC like ': '%' + this.ff_loc + '%' })
      }
      if (this.ff_storerkey.length > 0) {
        filter = $.extend(filter, { 'lotxlocxid.STORERKEY like ': '%' + this.ff_storerkey + '%' })
      }
      if (this.ff_po.length > 0) {
        filter = $.extend(filter, { 'receipt.EXTERNRECEIPTKEY like ': '%' + this.ff_po + '%' })
      }
      if (this.ff_sku.length > 0) {
        filter = $.extend(filter, { 'lotxlocxid.SKU like ': '%' + this.ff_sku + '%' })
      }
      if (this.ff_lot.length > 0) {
        filter = $.extend(filter, { 'lotxlocxid.LOT like ': '%' + this.ff_lot + '%' })
      }
      if (this.ff_qty.length > 0) {
        n = this.ff_qty.search(">") && this.ff_qty.search(">=") && this.ff_qty.search("<") && this.ff_qty.search("<=");
        if (n == -1) {
          filter = $.extend(filter, { 'lotxlocxid.QTY = ': this.ff_qty })
        } else {
          filter = $.extend(filter, { 'lotxlocxid.QTY ': this.ff_qty })
        }
      }
      if (this.ff_unit.length > 0) {
        filter = $.extend(filter, { 'pack.PACKUOM3 like ': '%' + this.ff_unit + '%' })
      }
      if (this.ff_qtyAllocated.length > 0) {
        filter = $.extend(filter, { 'lotxlocxid.QTYALLOCATED = ': this.ff_qtyAllocated })
      }
      if (this.ff_qtyPicked.length > 0) {
        filter = $.extend(filter, { 'lotxlocxid.QTYPICKED = ': this.ff_qtyPicked })
      }
      if (this.ff_status.length > 0) {
        filter = $.extend(filter, { 'lotxlocxid.STATUS like ': '%' + this.ff_status + '%' })
      }
      if (this.ff_lpnid.length > 0) {
        filter = $.extend(filter, { 'lotxlocxid.LPNID like ': '%' + this.ff_lpnid + '%' })
      }
      if (this.ff_cartonid.length > 0) {
        filter = $.extend(filter, { 'lotxlocxid.CARTONID like ': '%' + this.ff_cartonid + '%' })
      }
      if (this.ff_palletid.length > 0) {
        filter = $.extend(filter, { 'lotxlocxid.PALLETID like ': '%' + this.ff_palletid + '%' })
      }


    }
    this.list_dataOwner = this.authService.user.owners.map(owner => owner.storerkey); // this.appServices.account.listowner.map(p => p.storerkey);
    this.appServices.listInventory({ 'filter': JSON.stringify(filter), 'obj': JSON.stringify({ 'whseid': this.appServices.account.whseid, 'skip': skip, 'limit': limit, 'order': this.propertyName_ff ? this.propertyName_ff + " " + this.order_ff : null }), 'listOwner': JSON.stringify(this.list_dataOwner) }, this).then((obj) => {
      let json = obj.response.json().res;
      this.data_lotUpdate = json.res;
      this.data_lotUpdate.forEach(item => {
        item.LOTTABLE04 = this.datePipe.transform(item.LOTTABLE04, "yyyy-MM-dd");
        item.LOTTABLE05 = this.datePipe.transform(item.LOTTABLE05, "yyyy-MM-dd");
        item.LOTTABLE11 = this.datePipe.transform(item.LOTTABLE11, "yyyy-MM-dd");
        item.LOTTABLE12 = this.datePipe.transform(item.LOTTABLE12, "yyyy-MM-dd");
      });
      this.total = json.count;
      this.notifyService.show('There are ' + json.count + ' rows in database');
    }).catch(function (err) {
      err.component.notifyService.show(err.err.json().error.message, 'danger');
    })
  }
  onChoose(e, data) {
    if (e.target.checked) {
      this.data_rows.push(data);
    } else {
      let index = this.data_rows.indexOf(data);
      this.data_rows.splice(index, 1);
    }
  }
  checkAll_LotUpdate(e) {
    if (e.target.checked) {
      this.data_rows = new Array();
      this.data_lotUpdate.forEach(curr_data => {
        curr_data.state = e.target.checked;
        this.data_rows.push(curr_data);
      })
    } else {
      this.data_lotUpdate.forEach(x => x.state = e.target.checked);
      this.data_rows = [];
    }

  }
  isAllChecked_LotUpdate() {
    if (this.data_lotUpdate) {
      return this.data_lotUpdate.every(_ => _.state);
    }
  }
  findLotUpdateData(data) {
    this.selected_lotUpdate = data;
  }
  CloneToLotUpdateData(data) {
    this.data_lotUpdateDetail = new Array();
    this.data_lotUpdate.forEach(x => {
      x.LOTTABLE01 = data.lottable01;
      x.LOTTABLE02 = data.lottable02;
      x.LOTTABLE03 = data.lottable03;
      x.LOTTABLE04 = data.lottable04;
      x.LOTTABLE05 = data.lottable05;
      x.LOTTABLE06 = data.lottable06;
      x.LOTTABLE07 = data.lottable07;
      x.LOTTABLE08 = data.lottable08;
      x.LOTTABLE09 = data.lottable09;
      x.LOTTABLE10 = data.lottable10;
      x.LOTTABLE11 = data.lottable11;
      x.LOTTABLE12 = data.lottable12;
      this.data_lotUpdateDetail.push(x);
    });
    this.el.nativeElement.click($(function () {
      $('#modalEdit').modal('hide');
    })
    );
  }
  ConfirmLotUpdateData() {
    this.data_lotUpdate_detail_valid = [];
    if (this.data_rows.length == 0) {
      this.notifyService.warning('Please check or check all');
    } else {
      this.data_rows.forEach((element) => {
        element['whseid'] = this.authService.user.whseid;
        element['username'] = this.authService.user.username;
        element['LOTTABLE04'] = this.datePipe.transform(element['LOTTABLE04'], 'yyyy-MM-dd');
        element['LOTTABLE05'] = this.datePipe.transform(element['LOTTABLE05'], 'yyyy-MM-dd');
        element['LOTTABLE11'] = this.datePipe.transform(element['LOTTABLE11'], 'yyyy-MM-dd');
        element['LOTTABLE12'] = this.datePipe.transform(element['LOTTABLE12'], 'yyyy-MM-dd');
        if (element.QTYALLOCATED == 0 && element.QTYPICKED == 0) this.data_lotUpdate_detail_valid.push(element);
      });
      if (this.data_lotUpdate_detail_valid.length == 0) {
        this.notifyService.error('Have QtyAllocated or Qty, Cannot Update Lot');
      } else {
        this.appServices.transactionLotUpdate({ 'obj': JSON.stringify(this.data_lotUpdate_detail_valid) }, this).then((obj) => {
          this.data_rows = [];
          this.notifyService.success('Done');
          this.data_lotUpdateDetail = [];
          this.data_lotUpdate = [];
        }).catch(err => {
          this.utilityService.handleError(err);
        });
      }
    }
  }
}
