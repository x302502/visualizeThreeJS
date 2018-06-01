import { Component, ViewChild, ElementRef, ChangeDetectionStrategy, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { CompleterService, CompleterData } from 'ng2-completer';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/observable/of';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { PremoveListComponent } from "../premove/premove-list.component";



import * as $ from 'jquery';
import 'bootstrap';
import { AuthService } from '../../services/auth-service/auth.service';
type AOA = Array<Array<any>>;

@Component({
    selector: 'app-move',
    templateUrl: './move.component.html',
    styleUrls: ['./move.component.css']
})
export class MoveComponent implements OnInit, DynamicComponent {
    //#region Dynamic Component
    tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
    tabReload: EventEmitter<any> = new EventEmitter();
    //#endregion
    filter; currentPage = 1; itemsPerPage = 12; total = 0; data_temp;
    data_move; count_move = 0; data_location = [];
    total_move;
    data_rows = []; data_lpnid = [];
    list_location = [];
    data_excel; lines;
    No = "No"; headers = []; data_row_excel = [];
    data_headers = []; list_dataOwner = [];
    DECIMAL_SEPARATOR = ".";
    GROUP_SEPARATOR = ",";
    order_ff = 'ASC'; ff_loc = ''; propertyName_ff; ff_storerkey = ''; ff_po = ''; ff_lot = ''; ff_qty = ''; ff_qtyAllocated = ''; ff_qtyPicked = ''; ff_status = ''; ff_lpnid = ''; ff_sku = ''; ff_unit = ''

    wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
    constructor(public http: Http,
        private authService: AuthService,
        private appServices: AppServices,
        private notifyService: NotifyService,
        private _sanitizer: DomSanitizer,
        private completerService: CompleterService,
        private router: Router,
        private route: ActivatedRoute) { }
    ngOnInit() {
        this.loadLocationData();
    }
    // Load file excel and read
    onFileChange(evt: any) {
        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            /* read workbook */
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            /* save data */
            let data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
            let headers = data[0];
            this.data_headers = headers;
            data.splice(0, 1);
            this.lines = data;
            for (let i = 0; i < this.lines.length; i++) {
                let obj = {};
                let k = i;
                var currentline = this.lines[k].toString().split(",");
                for (var j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentline[k - i];
                    k++;
                }
                this.data_row_excel.push(obj);
            }
        };
        reader.readAsBinaryString(target.files[0]);
    }
    export() {
        /* this line is only needed if you are not adding a script tag reference */
        // if(typeof XLSX == 'undefined') XLSX = require('xlsx');

        /* make the worksheet */

        var ws = XLSX.utils.json_to_sheet(this.data_rows);
        /* add to workbook */
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        /* write workbook (use type 'binary') */
        var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        /* generate a download */
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "sheetjs.xlsx");
    }
    loadMoveData(param?) {
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
        }
        this.list_dataOwner = this.authService.user.owners.map(owner => owner.storerkey);// this.appServices.account.listowner.map(p => p.storerkey);
        this.appServices.listInventory({ 'filter': JSON.stringify(filter), 'obj': JSON.stringify({ 'whseid': this.appServices.account.whseid, 'skip': skip, 'limit': limit, 'order': this.propertyName_ff ? this.propertyName_ff + " " + this.order_ff : null }), 'listOwner': JSON.stringify(this.list_dataOwner) }, this).then((obj) => {
            let json = obj.response.json().res;
            this.data_move = json.res;
            console.log(this.data_move);

            this.total = json.count;
            this.notifyService.show('There are ' + json.count + ' rows in database');
        }).catch(function (err) {
            err.component.notifyService.show(err.err.json().error.message, 'danger');
        })
    }
    loadLocationData() {
        this.appServices.findLocation({ 'filter': JSON.stringify({ 'where': { 'whseid': this.appServices.account.whseid, 'deleted': false } }) }, this).then(function (obj) {
            let res = obj.response.json().res;
            obj.component.data_location = obj.component.completerService.local(res, 'loc', 'loc');
        }).catch((err) => {
            err.component.notifyService.show(err.err.json().error.message, 'danger');
        })
    }
    // loadLpnData() {
    //     this.appServices.findLpnid({ 'filter': JSON.stringify({ 'where': { 'whseid': this.appServices.account.whseid } }) }, this).then(function (obj) {
    //         let res = obj.response.json().res;
    //         obj.component.data_lpnid = obj.component.completerService.local(res, 'lpnid', 'lpnid');
    //         // let json = obj.response.json();
    //         // obj.component.data_location = json.res;
    //         // obj.component.data_location = obj.response.json().res;
    //     }).catch((err) => {
    //         err.component.notifyService.show(err.err.json().error.message, 'danger');
    //     })
    // }
    validQty(event) {
        var keycode = event.charCode || event.keyCode;
        if (keycode == 46 || keycode == 45 || keycode == 8) {
            return false;
        }
    }
    updateMoveData(data) {
        
        let checkQty = - data.move_qty + data.QTY;
        if (typeof data.tolpnid === 'undefined') data.tolpnid = data.LPNID
        if (checkQty >= 0) {
            this.appServices.findLocation({ 'filter': JSON.stringify({ 'where': { 'whseid': this.appServices.account.whseid, 'loc': data.tolocation } }) }, this)
                .then(function (obj) {
                    if (obj.response.json().res.length > 0) {
                        data['whseid'] = obj.component.appServices.account.whseid;
                        data['storerkey'] = data.STORERKEY;
                        data['sku'] = data.SKU;
                        data['lot'] = data.LOT;
                        data['status'] = data.STATUS;
                        data['loc'] = data.LOC;
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
                        data['username'] = obj.component.appServices.account.username;
                        data['lpnid'] = data.LPNID;
                        // data['tolpnid'] = data.tolpnid;
                        data['tolocation'] = data.tolocation;
                        data['move_qty'] = data.move_qty;
                        data['remark'] = data.reason;
                        data['unitid'] = data.UNITID;
                        data['cartonid'] = data.CARTONID;
                        data['palletid'] = data.PALLETID;
                        // if (data.QTY - data.move_qty < 0) {
                        //     obj.component.notifyService.warning('QTY MOVE GREAT THAN QTY_AVALABLE');
                        //     obj.component.loadMoveData();
                        // }
                        if (data.LOC === data.tolocation) {
                            obj.component.notifyService.warning('DUPLICATE LOCATION');
                            obj.component.loadMoveData();
                        }
                        else if (!data.tolocation) {
                            obj.component.notifyService.warning('TOLOCATION CAN NOT BE EMPTY');
                            obj.component.loadMoveData();
                        }
                        else if (data.QTYALLOCATED != 0 || data.QTYPICKED != 0) {
                            obj.component.notifyService.warning('HAVE QTYALLOCATED OR QTYPICKED, CANNOT MOVE');
                            obj.component.loadMoveData();
                        }
                        else {
                            obj.component.appServices.transactionQtyMove({ 'obj': JSON.stringify(data) }, obj.component).then(function (obj) {
                                let res = obj.response.res;
                                obj.component.notifyService.show('Process Done');
                                obj.component.loadMoveData();
                            }).catch(function (err) {
                                err.component.notifyService.show(err.err.json().err.message, 'warning');
                            });
                        }
                    } else {
                        obj.component.notifyService.show('Location Invalid', 'warning');
                    }
                }).catch(function (err) {
                    err.component.notifyService.show(err.err.json().error.message, 'warning');
                });
        }else  if (!data.move_qty) {
            this.notifyService.warning('QTY_MOVE CAN NOT BE EMPTY');
            this.loadMoveData();
        }else {
            this.notifyService.warning(' QTY MOVE LESS THAN QTY_AVALABLE');
            this.loadMoveData();
        }
    }
    onChoose(e, data) {
        if (e.target.checked) {
            this.data_rows.push(data);
        } else {
            let index = this.data_rows.indexOf(data);
            this.data_rows.splice(index, 1);
        }
    }
    checkAll(e) {
        if (e.target.checked) {
            this.data_rows = new Array();
            this.data_move.forEach(curr_data => {
                curr_data.state = e.target.checked;
                this.data_rows.push(curr_data);
            })
        } else {
            this.data_move.forEach(x => x.state = e.target.checked);
            this.data_rows = [];
        }

    }
    isAllChecked() {
        if (this.data_move) {
            return this.data_move.every(_ => _.state);
        }
    }
    saveToPreMove() {
        if (this.data_rows.length == 0) {
            this.notifyService.show("Please check or check all", 'danger');
        }
        else {
            this.data_rows.forEach((element) => {
                element['whseid'] = this.appServices.account.whseid;
                element['username'] = this.appServices.account.username;
                // value['movecode'] = movecode;
                element['toloc'] = element.tolocation;
                element['remark'] = element.reason;
                element['deleted'] = false;
            })
            let data = this.data_rows;
            this.appServices._saveToPreMove({ 'obj': JSON.stringify(data) }, this).then((obj) => {
                let res = obj.response.res;
                this.notifyService.show('Process Done');
                this.loadMoveData();
            }).catch(function (err) {
                err.component.notifyService.show(err.err.json().err.message, 'warning');
            });
        }
    }
    open() {
        let dynamicTabItem: DynamicTabItem = {
            title: 'Premove List',
            component: PremoveListComponent,
            data: {}
        }
        this.tabEmitter.emit(dynamicTabItem);
    }

}
