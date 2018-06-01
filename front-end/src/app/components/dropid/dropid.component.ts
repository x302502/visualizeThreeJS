import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { PasteService } from './../../paste.service';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { debug } from 'util';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dropid',
  templateUrl: './dropid.component.html',
  styleUrls: ['./dropid.component.css']
})
export class DropidComponent implements DynamicComponent {
    //#region Dynamic Component
    tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
    tabReload: EventEmitter<any> = new EventEmitter();
    //#endregion
  data_dropId = new Array();  currentPage = 1; itemsPerPage = 12; total = 0; data_temp; filter;
  data_warehouse; data_owner; list_dataOwner: any = []; order_ff = 'ASC';
  ff_receiptkey = '';propertyName_ff = '';ff_storerkey = '';ff_orderkey = '';ff_sku = '';ff_qty ;ff_palletid = '';ff_cartonid = '';ff_status='';ff_lpnid='';ff_unitid = '';ff_droptype = '';ff_commandtype = '';
 
  constructor(
    private router: Router,
    private appServices: AppServices,
    private notifyService: NotifyService,
    private datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.loadDropIdData();
  }
  loadDropIdData(param?: Object) {
    let p_qty; 
    let n ;
    let skip = (this.currentPage - 1) * this.itemsPerPage;
    let limit = Number(this.itemsPerPage);
    this.data_temp = null;
    let filter;
    if (param) {
       
        if(this.ff_storerkey.length > 0) {
            filter = $.extend(filter, {'dropid.STORERKEY like ': '%'+ this.ff_storerkey + '%'})
        }
        if(this.ff_receiptkey.length > 0) {
          filter = $.extend(filter, {'dropid.RECEIPTKEY like ': '%'+ this.ff_receiptkey + '%'})
      }
        if(this.ff_orderkey.length > 0) {
            filter = $.extend(filter, {'dropid.ORDERKEY like ':  '%'+ this.ff_orderkey + '%'})
        }
        if(this.ff_sku.length > 0) {
            filter = $.extend(filter, {'dropid.SKU like ': '%'+ this.ff_sku  + '%'})
        }
        if(this.ff_cartonid.length > 0) {
            filter = $.extend(filter, {'dropid.CARTONID like ': '%'+ this.ff_cartonid + '%'})
        }
        if(this.ff_qty) {
            n = this.ff_qty.search(">") && this.ff_qty.search(">=") && this.ff_qty.search("<") && this.ff_qty.search("<=");
            if( n == -1) {
                filter = $.extend(filter, {'dropid.QTY = ': this.ff_qty})
            } else {
                filter = $.extend(filter, {'dropid.QTY ': this.ff_qty})
            }
        }
        if(this.ff_unitid.length > 0) {
            filter = $.extend(filter, {'pack.UNITID like ': '%'+ this.ff_unitid + '%'})
        }
        if(this.ff_droptype.length > 0) {
            filter = $.extend(filter, {'dropid.QTYALLOCATED = ': this.ff_droptype})
        }
        if(this.ff_commandtype.length > 0) {
            filter = $.extend(filter, {'dropid.commandtype = ': this.ff_commandtype})
        }
        if(this.ff_status.length > 0) {
            filter = $.extend(filter, {'dropid.status like ': '%'+ this.ff_status + '%'})
        }
        if(this.ff_lpnid.length > 0) {
            filter = $.extend(filter, {'dropid.lpnid like ': '%'+ this.ff_lpnid + '%'})
        }
        if(this.ff_palletid.length > 0) {
            filter = $.extend(filter, {'dropid.palletid like ': '%'+ this.ff_palletid + '%'})
        }
    }
    this.list_dataOwner = this.appServices.account.owners.map(p => p.storerkey);
    this.appServices.listDropId({ 'filter': JSON.stringify(filter), 'obj': JSON.stringify({'whseid': this.appServices.account.whseid, 'skip': skip, 'limit': limit, 'order': this.propertyName_ff ? this.propertyName_ff + " " + this.order_ff : null}), 'listOwner':JSON.stringify(this.list_dataOwner) }, this).then(function (obj) {
        let json = obj.response.json();
        obj.component.data_dropId = json.res;
        // console.log( obj.component.data_dropId);
        obj.component.total = json.total;
        
    }).catch(function (err) {
        err.component.notifyService.show(err.err.json().error.message, 'danger');
    })
}

}
