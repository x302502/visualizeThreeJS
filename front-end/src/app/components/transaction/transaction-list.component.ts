import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { PasteService } from './../../paste.service';
import { DatePipe } from '@angular/common';
import { CompleterService, CompleterData } from 'ng2-completer';
import { Daterangepicker, DaterangepickerConfig } from 'ng2-daterangepicker';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import * as $ from 'jquery';
import 'bootstrap';
import { DynamicTabItem, DynamicComponent } from '../../common/dynamic-loader/dynamic-loader.model';
declare var moment :any;

@Component({
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.component.html',
    styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements DynamicComponent {
    //#region Dynamic Component
    tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
    tabReload: EventEmitter<any> = new EventEmitter();
    //#endregion
    data_transaction; total_transaction; currentPage = 1; itemsPerPage = 12; total = 0;
    count_transaction = 0; data_temp; list_dataOwner = [];listTransaction = new Array();
    filter; dateInput = { start: '', end: '' };
    options: any = {
        locale: { format: 'DD/MM/YYYY' },
        alwaysShowCalendars: true,
    };
    order_ff = 'ASC';ff_loc = '';propertyName_ff;ff_storerkey = '';ff_po = '';ff_lot = '';ff_qty = '';ff_qtyAllocated = '';ff_qtyPicked = '';ff_status='';ff_lpnid='';ff_sku = '';ff_unit = ''
    ff_toloc = ''; ff_trantype = '';ff_fromloc = '';ff_fromId ='';ff_toId = ''; ff_sourceType = '';
    ff_packkey = ''; ff_uom = '';ff_addDate = '';ff_addWho = '';

    constructor(private router: Router, private appServices: AppServices, private notifyService: NotifyService, private pasteService: PasteService, private datepipe: DatePipe, private daterangepickerOptions: DaterangepickerConfig) {

    }
    ngOnInit() {
        this.loadTransactionData();
    }
    selectedDate(value: any) {
        // any object can be passed to the selected event and it will be passed back here
        this.dateInput.start = value.start._d ? this.datepipe.transform(value['start'], 'yyyy-MM-dd HH:mm:ss') : '';
        this.dateInput.end = value.end._d ? this.datepipe.transform(value['end'], 'yyyy-MM-dd HH:mm:ss') : '';
        console.log(this.dateInput);
    }
    loadTransactionData(param?: Object) {
        let skip = (this.currentPage - 1) * this.itemsPerPage;
        let limit = Number(this.itemsPerPage);
        this.data_temp = null;
        let filter;
        if (param) {
          if(this.ff_loc.length > 0) {
              filter = $.extend(filter, {'itrn.FROMLOC like ': '%'+ this.ff_loc +'%'})
          }
          if(this.ff_storerkey.length > 0) {
              filter = $.extend(filter, {'itrn.STORERKEY like ': '%'+ this.ff_storerkey +'%'})
          }
          if(this.ff_sourceType.length > 0) {
              filter = $.extend(filter, {'itrn.SOURCETYPE like ': '%'+ this.ff_sourceType  +'%'})
          }
        //   if(this.ff_status.length > 0) {
        //       filter = $.extend(filter, {'itrn.STATUS like ': this.ff_status})
        //   }
          if(this.ff_sku.length > 0) {
              filter = $.extend(filter, {'itrn.SKU like ': '%'+ this.ff_sku +'%'})
          }
          if(this.ff_lot.length > 0) {
              filter = $.extend(filter, {'itrn.LOT like ': '%'+ this.ff_lot + '%'})
          }
          if(this.ff_qty.length > 0) {
              filter = $.extend(filter, {'itrn.QTY = ': this.ff_qty})
          }
          if(this.ff_unit.length > 0) {
              filter = $.extend(filter, {'pack.PACKUOM3 like ': '%'+ this.ff_unit + '%'})
          }
          if(this.ff_trantype.length > 0) {
              filter = $.extend(filter, {'itrn.TRANTYPE like ': '%'+ this.ff_trantype + '%'})
          }
          if(this.ff_fromloc.length > 0) {
              filter = $.extend(filter, {'itrn.FROMLOC like ': '%'+ this.ff_fromloc + '%'})
          }
          if(this.ff_toloc.length > 0) {
              filter = $.extend(filter, {'itrn.TOLOC like ': '%'+ this.ff_toloc + '%'})
          }
          if(this.ff_status.length > 0) {
              filter = $.extend(filter, {'itrn.STATUS like ':  '%'+ this.ff_status + '%'})
          }
          if(this.ff_fromId.length > 0) {
              filter = $.extend(filter, {'itrn.FROMLPNID like ': '%'+ this.ff_fromId + '%'})
          }
          if(this.ff_toId.length > 0) {
              filter = $.extend(filter, {'itrn.TOLPNID like ': '%'+ this.ff_toId + '%'})
          }
          if(this.ff_qty.length > 0) {
              filter = $.extend(filter, {'itrn.QTY like ': this.ff_qty})
          }
          if(this.ff_packkey.length > 0) {
              filter = $.extend(filter, {'itrn.PACKKEY like ': '%' +  this.ff_packkey + '%'})
          }
          if(this.ff_uom.length > 0) {
              filter = $.extend(filter, {'itrn.UOM like ': '%' +  this.ff_uom + '%'})
          }
          if(this.ff_addDate.length > 0) {
              filter = $.extend(filter, {'itrn.ADDDATE like ': this.ff_addDate})
          }
          if(this.ff_addWho.length > 0) {
              filter = $.extend(filter, {'itrn.ADDWHO like ': this.ff_addWho})
          }
      }
        this.list_dataOwner = this.appServices.account.owners.map(p => p.storerkey);
        this.appServices.listTransaction({'filter': JSON.stringify(filter), 'obj': JSON.stringify({'whseid': this.appServices.account.whseid, 'skip': skip, 'limit': limit, 'order': this.propertyName_ff ? this.propertyName_ff + " " + this.order_ff : null,'dateInput' : this.dateInput}),'lstOwner': JSON.stringify(this.list_dataOwner)}, this).then(function (obj) {
            if (obj.response.json().res.length == 0) {
                obj.component.notifyService.show('No data from your date range', 'warning');
            }
            else {
                let json = obj.response.json();
                // if (obj.component.data_transaction) {
                obj.component.data_transaction = json.res;
                obj.component.total = json.total;
                obj.component.notifyService.show('There are ' + json.total + ' rows in database');
                console.log(obj.component.data_transaction);
            }

            // } else {
            //   console.log(obj.component.data_transaction);
            //   this.notifyService.show('Date invalid');
            // }

            // if (obj.component.data_transaction) {
            //   obj.component.data_transaction = obj.component.data_transaction.concat(json.res);
            //   console.log(obj.component.data_transaction);
            // }else {
            //   obj.component.data_transaction = json.res;
            // }

        }).catch(function (err) {
            err.component.notifyService.show(err.err.json().error.message, 'danger');
        });
    }
    Export() {
        /* make the worksheet */
        console.log(this.listTransaction);
        var ws = XLSX.utils.json_to_sheet(this.listTransaction);
        /* add to workbook */
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Transaction");
        /* write workbook (use type 'binary') */
        var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        /* generate a download */
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        var nameSave = 'Transaction_Export_' + (new Date().getFullYear() + "/" + ("0" + new Date().getDate()).slice(-2)) + "/" + ("0" + (new Date().getMonth() + 1)).slice(-2) + " " + (new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()) + '.xlsx';
        console.log(nameSave);
        //  var nameSave = 'Transaction_Export_' + new Date().toISOString().substr(0, 19).replace('T', ' ') + '.xlsx';
        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), nameSave);
        //  FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }
    InitTransactionToExport(data) {
        // let list = [];
        let obj = {};
        data.forEach((value, index, arr) => {
            obj = {};
            obj['Warehouse (*)'] = value['WHSEID'] ? value['WHSEID'] : '';
            obj['ITRNKEY (*)'] = value['ITRNKEY'] ? value['ITRNKEY'] : '';
            obj['ITRNSYSID'] = value['ITRNSYSID'] ? value['ITRNSYSID'] : '';
            obj['TRANTYPE'] = value['TRANTYPE'] ? value['TRANTYPE'] : '';
            obj['STORERKEY'] = value['STORERKEY'] ? value['STORERKEY'] : '';
            obj['SKU'] = value['SKU'] ? value['SKU'] : '';
            obj['LOT'] = value['LOT'] ? value['LOT'] : '';
            obj['FROMLOC'] = value['FROMLOC'] ? value['FROMLOC'] : '';
            obj['FROMLPNID'] = value['FROMLPNID'] ? value['FROMLPNID'] : '';
            obj['FROMLOC'] = value['FROMLOC'] ? value['FROMLOC'] : '';
            obj['TOLOC'] = value['TOLOC'] ? value['TOLOC'] : '';
            obj['LOTTABLE01'] = value['LOTTABLE01'] ? value['LOTTABLE01'] : '';
            obj['LOTTABLE02'] = value['LOTTABLE02'] ? value['LOTTABLE02'] : '';
            obj['LOTTABLE03'] = value['LOTTABLE03'] ? value['LOTTABLE03'] : '';
            obj['LOTTABLE04'] = value['LOTTABLE04'] ? this.datepipe.transform(value['LOTTABLE04'], 'MM-dd-yyyy') : '';
            obj['LOTTABLE05'] = value['LOTTABLE05'] ? this.datepipe.transform(value['LOTTABLE05'], 'MM-dd-yyyy') : '';
            obj['LOTTABLE06'] = value['LOTTABLE06'] ? value['LOTTABLE06'] : '';
            obj['LOTTABLE07'] = value['LOTTABLE07'] ? value['LOTTABLE07'] : '';
            obj['LOTTABLE08'] = value['LOTTABLE08'] ? value['LOTTABLE08'] : '';
            obj['LOTTABLE09'] = value['LOTTABLE09'] ? value['LOTTABLE09'] : '';
            obj['LOTTABLE10'] = value['LOTTABLE10'] ? value['LOTTABLE10'] : '';
            obj['LOTTABLE11'] = value['LOTTABLE11'] ? this.datepipe.transform(value['LOTTABLE11'], 'MM-dd-yyyy') : '';
            obj['LOTTABLE12'] = value['LOTTABLE12'] ? this.datepipe.transform(value['LOTTABLE12'], 'MM-dd-yyyy') : '';
            obj['SOURCEKEY'] = value['SOURCEKEY'] ? value['SOURCEKEY'] : '';
            obj['STATUS'] = value['STATUS'] ? value['STATUS'] : '';
            obj['CASECNT'] = value['CASECNT'] ? value['CASECNT'] : '';
            obj['INNERPACK'] = value['INNERPACK'] ? value['INNERPACK'] : '';
            obj['QTY'] = value['QTY'] ? value['QTY'] : '';
            obj['CUBE'] = value['CUBE'] ? value['CUBE'] : '';
            obj['GROSSWGT'] = value['GROSSWGT'] ? value['GROSSWGT'] : '';
            obj['NETWGT'] = value['NETWGT'] ? value['NETWGT'] : '';
            obj['OTHERUNIT1'] = value['OTHERUNIT1'] ? value['OTHERUNIT1'] : '';
            obj['OTHERUNIT2'] = value['OTHERUNIT2'] ? value['OTHERUNIT2'] : '';
            obj['PACKKEY'] = value['PACKKEY'] ? value['PACKKEY'] : '';
            obj['UOM'] = value['UOM'] ? value['UOM'] : '';
            obj['UOMCALC'] = value['UOMCALC'] ? value['UOMCALC'] : '';
            obj['UOMQTY'] = value['UOMQTY'] ? value['UOMQTY'] : '';
            obj['EFFECTIVEDATE'] = value['EFFECTIVEDATE'] ? this.datepipe.transform(value['EFFECTIVEDATE'], 'MM-dd-yyyy') : '';
            obj['RECEIPTKEY'] = value['RECEIPTKEY'] ? value['RECEIPTKEY'] : '';
            obj['RECEIPTLINENUMBER'] = value['RECEIPTLINENUMBER'] ? value['RECEIPTLINENUMBER'] : '';
            obj['HOLDCODE'] = value['HOLDCODE'] ? value['HOLDCODE'] : '';
            obj['COUNTSEQUENCE'] = value['COUNTSEQUENCE'] ? value['COUNTSEQUENCE'] : '';
            obj['ADDWHO'] = value['ADDWHO'] ? value['ADDWHO'] : '';
            obj['EDITDATE'] = value['EDITDATE'] ? this.datepipe.transform(value['EDITDATE'], 'MM-dd-yyyy') : '';
            obj['EDITWHO'] = value['EDITWHO'] ? value['EDITWHO'] : '';
            obj['FINALTOLOC'] = value['FINALTOLOC'] ? value['FINALTOLOC'] : '';
            obj['INTRANSIT'] = value['INTRANSIT'] ? value['INTRANSIT'] : '';
            obj['DESCRIPTION'] = value['DESCRIPTION'] ? value['DESCRIPTION'] : '';
            obj['OWNER'] = value['OWNER'] ? value['OWNER'] : '';
            obj['REMARK'] = value['REMARK'] ? value['REMARK'] : '';
            if (value.ADDDATE != null) {
                let check = new Date(value.ADDDATE);
                var dateM = moment(value.ADDDATE).add(7, 'hours')
                var date = new Date(dateM)
                let day = ("0" + date.getDate()).slice(-2);
                let month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
                let year = date.getFullYear();
                let hour = ("0" + date.getHours()).slice(-2);
                let minute = ("0" + date.getMinutes()).slice(-2);
                let second = ("0" + date.getSeconds()).slice(-2);
                value['ADDDATE'] = day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
                obj['ADDDATE'] = value['ADDDATE'];
            }
            if (value['error']) obj['Error'] = value['error'];
            this.listTransaction.push(obj);
        })
        return this.listTransaction;
    }
}
