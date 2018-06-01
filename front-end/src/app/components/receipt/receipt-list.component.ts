import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { PasteService } from './../../paste.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { CompleterService, CompleterData } from 'ng2-completer';

import { DatePipe } from '@angular/common';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { PopupLocationComponent } from '../../common/popup-location/popup-location.component';
import { PopupSKUComponent } from '../../common/popup-sku/popup-sku.component';
import { PopupCheckinComponent } from '../../common/popup-checkin/popup-checkin.component';
import { TaskdetailListComponent } from '../taskdetail/taskdetail-list.component';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { log, debug } from 'util';
import { NgForm } from '@angular/forms';
import * as uuid from 'uuid';

import * as $ from 'jquery';
import 'bootstrap';
import { GridOption } from '../../common/grid-control/grid-control';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { SocketService, ISocketData } from '../../services/socket.service';
import { ReportService } from '../../services/report.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { ApiService } from '../../services/api-service/api.service';

type AOA = Array<Array<any>>;
@Component({
    selector: 'app-receipt-list',
    templateUrl: './receipt-list.component.html',
})
export class ReceiptListComponent implements OnInit, DynamicComponent {

    tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
    tabReload: EventEmitter<any> = new EventEmitter();
    @ViewChild('grid') grid: GridControlComponent;
    gridOption: GridOption;
    socketSubcription: any;


    @ViewChild('tabDetail') tabDetail: ElementRef;
    data_receipt; record_receipt: any = {}; selected_receipt; qtyReceipt; data_item; data_totalReceiptDetail
    data_receiptdetail; new_receiptdetail; status_receiptdetail; total_receiptdetail; loaddata_receiptdetail;
    uom_data; data_SKU; selected_sku; data_storer; data_codelkup; data_supplier;
    data_pack; data_replay; data_lot; data_statusRe; data_location; packkey; data_check; uom_data1; listreceipt;
    content_csv;
    count_receiptdetail = 0;
    delete_receipt = []; delete_receiptdetail = []; data_rowdetail = []; row_checked = [];
    total_receipt = 0; itemsPerPage_receipt = 12; currentPage_receipt = 1; data_itemsPerPage = [];
    total_receiptDetail = 0; itemsPerPage_receiptDetail = 12; currentPage_receiptDetail = 1;
    currentPage_location = 1; itemsPerPage_location; delete_location;
    filter; data_excel;
    headers = [];
    data_row_excel = [];
    lines;
    data_headers = [];
    wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
    dataExcel_ASN;
    STT = "STT";
    headersToShow = ["STT", "Receiptkey", "Owner", "Po", "Containerkey", "Status", "Receiptdate", "Openqty"];
    indices = [];
    calculatedPrices = [];
    f_receiptkey = ''; f_status = ''; f_storerkey = ''; f_externreceiptkey = ''; f_containerkey = ''; f_editdate = '';
    f_sku = ''; f_descr = ''; f_loc = ''; f_putawayzone = '';
    propertyName; order = 'ASC';
    public color2: string = "lig"; list_dataOwner;
    id = {
        tabListASN: uuid.v4(),
        tabDetail: uuid.v4(),
        uom: uuid.v4()
    }

    @ViewChild('frrmReceipt') frrmReceipt: NgForm;
    constructor(private router: Router,
        private appServices: AppServices,
        private notifyService: NotifyService,
        private pasteService: PasteService,
        public authService: AuthService,
        private completerService: CompleterService,
        private datepipe: DatePipe,
        private el: ElementRef,
        private socketService: SocketService,
        private apiService: ApiService,
        private reportService: ReportService) {
    }
    ngOnInit() {
        $('body').off('paste');
        this.authService.checkToken();
        this.initReceipt();
        this.loadReceiptData()
        this.loadStorerData();
        this.loadSupplierData();
        this.loadCodelkupData();
        this.loadOnePackData();
        this.socketSubcription = this.socketService.emitter.subscribe((socketData: ISocketData) => {
            if (socketData.code === "ASN_CREATE" || socketData.code === "ASN_UPDATE" || socketData.code === "ASN_DELETE") {
                this.grid.reload();
            }
        });
    }


    onFileChange(evt: any) {
        // this.data_row_excel = [];
        // let data = undefined;
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];
            let data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
            let headers = data[0];
            if (headers[0] != 'OWNER' && headers[2] != 'PACKINGLIST' && headers[4] != 'SUPPLIERCODE' && headers[6] != 'ITEMCODE') {
                this.notifyService.error('Template incorrect');
            } else {
                this.data_headers = headers;
                data.splice(0, 1);
                this.lines = data.sort();
                for (let i = 0; i < this.lines.length; i++) {
                    if (this.lines[i].length != 0) {
                        let obj = {};
                        let k = i;
                        var currentline = this.lines[k].toString().split(",");
                        for (var j = 0; j < headers.length; j++) {
                            if (currentline[k - i] != "" || currentline[k - i] != undefined) {
                                obj[headers[j]] = currentline[k - i];
                                k++;
                            }
                        }
                        obj['whseid'] = this.appServices.account.whseid;
                        obj['addwho'] = this.appServices.account.username;
                        this.data_row_excel.push(obj);
                        this.data_row_excel.forEach((ex, index) => {
                            let suppliername;
                            this.data_supplier.forEach(sup => {
                                if (sup.storerkey == ex.SUPPLIERCODE) {
                                    suppliername = sup.company
                                }
                                else ex['suppliername'] = ''
                            });
                            ex['storerkey'] = ex.OWNER;
                            ex['type'] = ex.TYPE;
                            ex['status'] = "0";
                            ex['externreceiptkey'] = ex.PACKINGLIST;
                            ex['containerkey'] = ex.CONTAINER;
                            ex['suppliercode'] = ex.SUPPLIERCODE;
                            ex['suppliername'] = suppliername;
                            ex['notesorder'] = ex.REMARK;
                            ex['sku'] = ex.ITEMCODE;
                            ex['uom'] = ex.UOM;
                            ex['qtyexpected'] = ex.EXQUANTITY;
                            ex['notes'] = ex.REMARKDETAIL;
                            ex['toloc'] = ex.LOCATION != "" ? ex.LOCATION : "STAGE";;
                            ex['lottable01'] = ex.LOTTABLE01;
                            ex['lottable02'] = ex.LOTTABLE02;
                            ex['lottable03'] = ex.LOTTABLE03;
                            ex['lottable04'] = ex.LOTTABLE04;
                            ex['lottable05'] = ex.LOTTABLE05;
                            ex['shelflife'] = ex.SHELFLIFE;
                            ex['lottable06'] = ex.LOTTABLE06;
                            ex['lottable07'] = ex.LOTTABLE07;
                            ex['lottable08'] = ex.LOTTABLE08;
                            ex['lottable09'] = ex.LOTTABLE09;
                            ex['lottable10'] = ex.LOTTABLE10;
                            ex['lottable11'] = ex.LOTTABLE11;
                            ex['lottable12'] = ex.LOTTABLE12;
                            ex['unitid'] = ex.UNITID;
                            ex['cartonid'] = ex.CARTONID;
                            ex['palletid'] = ex.PALLETID;
                        })
                    }
                }
            }
        };
        reader.readAsBinaryString(target.files[0]);
    }
    initExcel() {
        this.data_headers = [];
        this.data_row_excel = [];
    }

    arrayFromObject(obj) {
        var arr = [];
        for (var i in obj) {
            arr.push(obj[i]);
        }
        this.dataExcel_ASN = arr;
    }

    groupBy(list, fn) {
        var groups = {};
        for (var i = 0; i < list.length; i++) {
            var group = JSON.stringify(fn(list[i]));
            if (group in groups) {
                groups[group].push(list[i]);
            } else {
                groups[group] = [list[i]];
            }
        }
        return this.arrayFromObject(groups);
    }

    saveDataExcelCheck() {
        let promises = [];
        let sku;
        let pack;
        let qtyexpected;
        this.groupBy(this.data_row_excel, function (item) { return [item.PACKINGLIST]; });
        promises.push(new Promise((resolve, reject) => {

            this.appServices.insertExcelASN({ 'obj': JSON.stringify(this.dataExcel_ASN) }, this)
                .then((obj) => {
                    resolve();
                }).catch(function (err) {
                    reject(err);
                });
        }));
        Promise.all(promises).then(() => {
            this.notifyService.success('Done');
            this.loadReceiptData();
        }).catch(err => {
            if (err.err.json()) this.notifyService.error(err.err.json().error.message);
            else this.notifyService.error(err);
        })
    }

    export() {
        var ws = XLSX.utils.json_to_sheet(this.data_receipt);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "People");
        var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        var nameSave = 'Receipt_' + (new Date().getFullYear() + "/" + ("0" + new Date().getDate()).slice(-2)) + "/" + ("0" + (new Date().getMonth() + 1)).slice(-2) + " " + (new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()) + '.xlsx';
        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), nameSave);
    }

    loadTaskDetail() {
        $(this.tabDetail.nativeElement).tab('show');
    }

    loadReceiptData(param?: Object) {
        let skip = (this.currentPage_receipt - 1) * this.itemsPerPage_receipt;
        let limit = this.itemsPerPage_receipt;
        let filter;
        if (param) {
            if (this.f_receiptkey.length > 0) filter = $.extend(filter, { 'receiptkey like': this.f_receiptkey });
            if (this.f_status.length > 0) filter = $.extend(filter, { 'status like': this.f_status });
            if (this.f_storerkey.length > 0) filter = $.extend(filter, { 'storerkey like': this.f_storerkey });
            if (this.f_externreceiptkey.length > 0) filter = $.extend(filter, { 'externreceiptkey like': this.f_externreceiptkey });
            if (this.f_containerkey.length > 0) filter = $.extend(filter, { 'containerkey like': this.f_containerkey });
            if (this.f_editdate.length > 0) filter = $.extend(filter, { 'editdate like': this.f_editdate });
        }
        let storerkey = this.authService.user.strOwners;
        this.appServices.listReceipt({ 'obj': JSON.stringify({ 'whseid': this.appServices.account.whseid, 'deleted': false, storerkey: storerkey, 'skip': skip, 'limit': limit, 'order': this.propertyName ? this.propertyName + " " + this.order : null }), 'filter': JSON.stringify(filter) }, this)
            .then((obj) => {
                let json = obj.response.json();
                this.data_receipt = json.res;
                this.total_receipt = json.total;
            }).catch((err) => {
                this.notifyService.error(err.err.json().error.message);
            });
    }

    loadStorerData() {
        this.appServices.getlistStorer({ 'whseid': this.appServices.account.whseid, 'type': "1", 'deleted': false }, this).then(function (obj) {
            obj.component.data_storer = obj.response.json().res;
        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        })
    }
    loadSupplierData() {
        this.appServices.getlistStorer({ 'whseid': this.appServices.account.whseid, 'type': "5", 'deleted': false }, this).then(function (obj) {
            obj.component.data_supplier = obj.response.json().res;
        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        })
    }
    loadOneStorerData(data) {
        let filter = JSON.stringify({ "where": { "whseid": this.appServices.account.whseid, "storerkey": data.storerkey, "type": "1", "deleted": false } });
        this.appServices.findStorer({ filter }, this).then(function (obj) {
            obj.component.data_storer = obj.response.json().res;
            if (obj.component.data_storer.length > 0) {
                obj.component.data_lot = JSON.parse(obj.component.data_storer[0].lottable);
            }
        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        })
    }

    loadOneStorerData1(data) {
        this.authService.user.owners.forEach(owner => {
            if (owner.storerkey == data.storerkey) {
                this.data_storer = owner;
                let json = JSON.parse(owner.lottable);
                for (let key in json) {
                    if (json[key].active == false) {
                        delete json[key];
                    } else {
                        json[key].key = key;
                    }
                }
                this.data_lot = json;
            }
        })
    }

    loadCodelkupData() {
        this.appServices.findCodelkup({
            'filter': JSON.stringify({
                'where': $.extend({
                    'whseid': this.appServices.account.whseid,
                    'listname': 'RECEIPTYPE',
                    'deleted': false,
                    'skip': 0
                }, this.filter)
            })
        }, this).then(function (obj) {
            obj.component.data_codelkup = obj.response.json().res;
        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        });
    }


    loadStatusReceiptdetailData() {
        this.appServices.findCodelkup({
            'filter': JSON.stringify({
                'where': $.extend({
                    'whseid': this.appServices.account.whseid,
                    'listname': 'STATUSRECEIPTDETAIL',
                    'deleted': false,
                    'skip': 0
                }, this.filter)
            })
        }, this).then(function (obj) {
            obj.component.status_receiptdetail = obj.response.json().res;
        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        });
    }

    loadUOM(data) {
        if (data != undefined) {
            this.data_SKU._data.forEach((value, index, arr) => {
                if (value.SKU == data) {
                    this.packkey = value.PACKKEY;
                }
            })
            this.appServices.getUOM({ 'whseid': this.appServices.account.whseid, 'packkey': this.packkey, 'deleted': false, 'skip': 0 }, this).then(function (obj) {
                obj.component.uom_data = obj.response.json().res;
            }).catch((err) => {
                this.notifyService.error(err.err.json().error.message);
            })
        }
    }
    dataPack = {

    };
    loadUOM1 = async (data) => {
        if (this.data_SKU) {
            if (data != undefined) {
                try {
                    this.data_SKU._data.forEach((value, index, arr) => {
                        if (value.SKU == data) {
                            this.packkey = value.PACKKEY;
                        }
                    });
                    if (this.dataPack[this.packkey]) {
                        this.uom_data1 = Object.assign([], this.dataPack[this.packkey].response.json().res);
                    } else {
                        this.dataPack[this.packkey] = await this.appServices.getUOM({ 'whseid': this.appServices.account.whseid, 'packkey': this.packkey, 'deleted': false, 'skip': 0 }, this);
                        this.uom_data1 = Object.assign([], this.dataPack[this.packkey].response.json().res);
                    }
                }
                catch (e) {
                    this.notifyService.error(e);
                }
            }
        }
    }

    totalReceiptdetail(data) {
        this.appServices.totalReceiptDetail({ 'obj': JSON.stringify(data) }, this).then((obj) => {
            this.data_totalReceiptDetail = obj.response.json().res;
            this.record_receipt['totalexpected'] = this.data_totalReceiptDetail.totalexpected;
            this.record_receipt['totalreceived'] = this.data_totalReceiptDetail.totalreceived;
        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        })
    }

    loadLocation() {
        this.appServices.getlistLocation({ 'whseid': this.appServices.account.whseid, 'deleted': false }, this).then(function (obj) {
            obj.component.data_location = obj.response.json().res;
        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        })
    }

    loadOnePackData() {
        this.appServices.listPack({ 'whseid': this.appServices.account.whseid, 'deleted': false, 'skip': 0 }, this).then(function (obj) {
            obj.component.data_pack = obj.response.json().res;
        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        })
    }

    loadReceiptDetailData = async (data) => {
        try {
            let skip = (this.currentPage_receiptDetail - 1) * this.itemsPerPage_receiptDetail;
            let limit = this.itemsPerPage_receiptDetail;
            let pack;
            let sku;
            let qtyexpected;
            let qtyreceived;
            let filter;
            let countReceive = [];
            if (skip == 0) {
                this.data_receiptdetail = [];
                this.count_receiptdetail = skip;
            }
            this.changeOwner(data);
            let obj = await this.appServices.listReceiptDetail({ 'whseid': this.appServices.account.whseid, 'receiptkey': data.receiptkey, 'deleted': false }, this);
            let json = obj.response.json();
            if (this.data_receiptdetail) {
                this.data_receiptdetail = this.data_receiptdetail.concat(json.res);
            }
            else {
                this.data_receiptdetail = json.res;
            }
            this.total_receiptDetail = json.total;
            let arraydata;
            if (this.data_receiptdetail.length > 0) {
                for (let index = 0; index < this.data_receiptdetail.length; index++) {
                    let value = this.data_receiptdetail[index];
                    let arr = this.data_receiptdetail;
                    this.data_pack.forEach((valuepack, indexpack, arrpack) => {
                        if (value.packkey == valuepack.packkey) {
                            pack = valuepack;
                        }
                    })

                    if (value.uom == pack.packuom2) {
                        if (pack.innerpack == 0 || pack.packuom2 == "") {
                            qtyexpected = value.qtyexpected / 1;
                            qtyreceived = value.qtyreceived / 1;
                        }
                        qtyexpected = value.qtyexpected / pack.innerpack;
                        qtyreceived = value.qtyreceived / pack.innerpack;
                    }
                    if (value.uom == pack.packuom3) {
                        qtyexpected = value.qtyexpected / pack.qty;
                        qtyreceived = value.qtyreceived / pack.qty;
                    }
                    if (value.uom == pack.packuom4) {
                        qtyexpected = value.qtyexpected / pack.pallet;
                        qtyreceived = value.qtyreceived / pack.pallet;
                    }
                    if (value.status == 9) {
                        countReceive.push(value.status)
                    }
                    value.qtyexpected = qtyexpected;
                    value.qtyreceived = qtyreceived;
                    value.lottable04 = this.datepipe.transform(value.lottable04, "yyyy-MM-dd");
                    value.lottable05 = this.datepipe.transform(value.lottable05, "yyyy-MM-dd");
                    value.lottable11 = this.datepipe.transform(value.lottable11, "yyyy-MM-dd");
                    value.lottable12 = this.datepipe.transform(value.lottable12, "yyyy-MM-dd");
                    await this.loadUOM1(value.sku);
                }
                let length = this.data_receiptdetail.length;
                let countlinenumber = this.data_receiptdetail[length - 1].receiptlinenumber;
                let receiptlinenumber = countlinenumber.replace(parseInt(countlinenumber).toString(), (parseInt(countlinenumber) + 1).toString());
                arraydata = {
                    storerkey: data.storerkey,
                    receiptlinenumber: receiptlinenumber
                }
            } else {
                arraydata = {
                    storerkey: data.storerkey,
                    receiptlinenumber: ''
                }
            }
            this.initReceiptDetail(arraydata);
        }
        catch (e) {
            this.notifyService.error(e);
        }
    }

    saveReceiptData(data) {
        let counterror = 0;
        let flag;
        this.data_receipt.forEach((valuereceipt, indexreceipt, arrreceipt) => {
            if (data.externreceiptkey == valuereceipt.EXTERNRECEIPTKEY) {
                flag = false;
            }
            if (indexreceipt == arrreceipt.length - 1) {
                if (flag == false) {
                    this.notifyService.error("Packing List existed");
                }
            }
        })
        if (this.data_receiptdetail.length >= 0) {
            this.data_receiptdetail.forEach((value, index, arr) => {
                if (value.status == '' && data.status != undefined || value.status == '0' && data.status != undefined) {
                    counterror = 0;
                } else if (value.sku == "") {
                    this.notifyService.error("Linenumber " + value.receiptlinenumber + " Sku can not empty");
                    counterror++;
                } else if (value.uom == "") {
                    this.notifyService.error("Linenumber " + value.receiptlinenumber + " Uom can not empty");
                    counterror++;
                } else if (value.qtyexpected == "") {
                    this.notifyService.error("Linenumber " + value.receiptlinenumber + " Expected Quantity can not empty");
                    counterror++;
                } else if (value.lottable04 > value.lottable05) {
                    this.notifyService.error("Product date can not be greater than expiry date.");
                    counterror++;
                }
            })

            if (counterror == 0) {
                if (data['id'] === null || typeof data['id'] === 'undefined') {
                    this.insertReceiptData(data)
                    this.loadReceiptData();
                } else {
                    this.updateReceiptData(data);
                    this.loadReceiptData();
                }
            }
        }
    }

    insertReceiptData(data) {
        this.data_supplier.forEach(sup => {
            if (sup.storerkey == data.suppliercode)
                data.suppliername = sup.company
            else data.suppliername = ''
        });
        data['whseid'] = this.appServices.account.whseid;
        data['status'] = "0";
        data['deleted'] = false;
        data['addwho'] = this.appServices.account.username;
        data['adddate'] = new Date();
        this.generate();
        data['receiptdetails'] = this.data_receiptdetail;
        this.appServices.createReceipt({ 'obj': data }, this).then((obj) => {
            let res = obj.response.json();
            this.notifyService.success('Create Done');
            this.findReceiptData(res)
            this.data_replay = res;
        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        });
    }


    generate() {
        let pack;
        let sku;
        let qtyexpected;
        let qtyreceived;
        this.data_receiptdetail.forEach((value, index, arr) => {
            this.data_SKU._data.forEach((valuesku, indexsku, arrsku) => {
                if (value.sku == valuesku.SKU) {
                    sku = valuesku;
                }
            })
            this.data_pack.forEach((valuepack, indexpack, arrpack) => {
                if (sku.PACKKEY == valuepack.packkey) {
                    pack = valuepack;
                }
            })

            if (value.uom == pack.packuom2) {
                if (pack.innerpack == 0 || pack.packuom2 == "") {
                    qtyexpected = value.qtyexpected * 1;
                    qtyreceived = value.qtyreceived * 1;
                } else {
                    qtyexpected = value.qtyexpected * pack.innerpack;
                    qtyreceived = value.qtyreceived * pack.innerpack;
                }
            }
            if (value.uom == pack.packuom3) {
                qtyexpected = value.qtyexpected * pack.qty;
                qtyreceived = value.qtyreceived * pack.qty;
            }
            if (value.uom == pack.packuom4) {
                qtyexpected = value.qtyexpected * pack.pallet;
                qtyreceived = value.qtyreceived * pack.pallet;
            }
            value.qtyexpected = qtyexpected;
            value.qtyreceived = qtyreceived;
            value['cube'] = (qtyexpected) * (sku.STDCUBE);
            value['grosswgt'] = (qtyexpected) * (sku.STDCUBE);
            value['netwgt'] = (qtyexpected) * (sku.STDNETWGT);
            value['packkey'] = pack.packkey;
            value['pallet'] = pack.pallet;
            value['innerpack'] = pack.innerpack;
            value['casecnt'] = pack.casecnt;
            value['toloc'] = value['toloc'] != undefined ? value['toloc'] : "STAGE"
            value['lottable04'] = this.datepipe.transform(value['lottable04'], 'yyyy-MM-dd');
            value['lottable05'] = this.datepipe.transform(value['lottable05'], 'yyyy-MM-dd');
            value['lottable11'] = this.datepipe.transform(value['lottable11'], 'yyyy-MM-dd');
            value['lottable12'] = this.datepipe.transform(value['lottable12'], 'yyyy-MM-dd');

        })
    }

    _insertReceipDetailtData() {
        let promises = [];
        let data = this.data_receiptdetail;
        let dataLot = this.data_lot;
        let arrlottable;
        let pack;
        let sku;
        let qtyexpected;
        if (data) {
            this.data_receiptdetail.forEach((value, index, arr) => {
                this.data_SKU._data.forEach((valuesku, indexsku, arrsku) => {
                    if (value.sku == valuesku.SKU) {
                        sku = valuesku;
                    }
                })
                this.data_pack.forEach((valuepack, indexpack, arrpack) => {
                    if (sku.PACKKEY == valuepack.packkey) {
                        pack = valuepack;
                    }
                })
                if (value.uom == pack.packuom2) {
                    if (pack.innerpack == 0 || pack.packuom2 == "") {
                        qtyexpected = value.qtyexpected * 1;
                    } else {
                        qtyexpected = value.qtyexpected * pack.innerpack;
                    }
                }
                if (value.uom == pack.packuom3) {
                    qtyexpected = value.qtyexpected * pack.qty;
                }
                if (value.uom == pack.packuom4) {
                    qtyexpected = value.qtyexpected * pack.pallet;
                }
                let cube = (qtyexpected) * (sku.STDCUBE)
                let grosswgt = (qtyexpected) * (sku.STDGROSSWGT)
                let netwgt = (qtyexpected) * (sku.STDNETWGT)
                value['whseid'] = this.appServices.account.whseid;
                value['receiptkey'] = this.data_replay.receiptkey;
                value['receiptreceiptlinenumber'] = value.receiptlinenumber;
                value['qtyexpected'] = qtyexpected;
                value['toloc'] = value['toloc'] !== undefined ? value['toloc'] : "STAGE";
                value['lpnid'] = (this.data_replay.receiptkey) + (value.receiptlinenumber);
                value['storerkey'] = value.storerkey;
                value['externreceiptkey'] = this.data_replay.externreceiptkey;
                value['cube'] = cube;
                value['grosswgt'] = grosswgt;
                value['netwgt'] = netwgt;
                value['packkey'] = pack.packkey;
                value['casecnt'] = pack.casecnt;
                value['innerpack'] = pack.innerpack;
                value['pallet'] = pack.pallet;
                value['type'] = this.data_replay.receipttype;
                value['deleted'] = false;
                value['addwho'] = this.appServices.account.username;
                value['editwho'] = this.appServices.account.username;
                value['lottable04'] = this.datepipe.transform(value['lottable04'], 'yyyy-MM-dd');
                value['lottable05'] = this.datepipe.transform(value['lottable05'], 'yyyy-MM-dd');
                value['lottable11'] = this.datepipe.transform(value['lottable11'], 'yyyy-MM-dd');
                value['lottable12'] = this.datepipe.transform(value['lottable12'], 'yyyy-MM-dd');
                promises.push(new Promise((resolve, reject) => {
                    this.appServices.insertReceiptDetail({ 'obj': JSON.stringify(value) }, this).then((obj) => {
                        resolve();
                    }).catch(function (err) {
                        reject(err);
                    });
                }));
            });
            Promise.all(promises).then(() => {
                this.notifyService.success('Process Done');
                this.findReceiptData(this.data_replay);
            }).catch(err => {
                this.notifyService.error(err.err.json().error.message);
            })
        }
    }

    insertReceipDetailtData() {
        let promises = [];
        let data = this.data_receiptdetail;
        if (this.data_receiptdetail) {
            promises.push(new Promise((resolve, reject) => {
                this.appServices.insertReceiptDetail({ 'obj': JSON.stringify(this.data_receiptdetail) }, this).then((obj) => {
                    resolve();
                }).catch(function (err) {
                    reject(err);
                });
            }));
            Promise.all(promises).then(() => {
                this.notifyService.success('Process Done');
                this.findReceiptData(this.data_replay);
            }).catch(err => {
                this.notifyService.error(err.err.json().error.message);
            })
        }
    }

    findReceiptData(data) {
        $(this.tabDetail.nativeElement).tab('show');
        this.record_receipt = data;
        this.totalReceiptdetail(this.record_receipt);
        this.loadReceiptDetailData(this.record_receipt);
        this.loadOneStorerData1(this.record_receipt)
        this.loadStatusReceiptdetailData();
    }

    updateReceiptData(data) {
        this.data_supplier.forEach(sup => {
            if (sup.storerkey == data.suppliercode)
                data.suppliername = sup.company;
            else data.suppliername = ''
        });
        data['whseid'] = this.appServices.account.whseid;
        data['status'] = data.status;
        data['deleted'] = false;
        data['addwho'] = this.appServices.account.username;
        data['editwho'] = this.appServices.account.username;
        this.generate();
        data['receiptdetails'] = this.data_receiptdetail.filter(e => e.status != 9 && e.status != 5);
        this.appServices.updateReceipt({ 'obj': data }, this).then((obj) => {
            this.notifyService.success('Update Done');
            this.updateStatusReceipt(this.record_receipt);
            this.findReceiptData(this.record_receipt);
        }).catch(function (err) {
            this.notifyService.error(err.err.json().error.message);
        });
    }

    updateReceipDetailtData() {
        let promises = [];
        let data = this.data_receiptdetail;
        let dataLot = this.data_lot;
        let arrlottable;
        let pack;
        let sku;
        let qtyexpected;
        if (data) {
            this.data_receiptdetail.forEach((value, index, arr) => {
                if (value.status == '' || value.status == '0' || value.status == undefined) {
                    this.data_SKU._data.forEach((valuesku, indexsku, arrsku) => {
                        if (value.sku == valuesku.SKU) {
                            sku = valuesku;
                        }
                    })
                    this.data_pack.forEach((valuepack, indexpack, arrpack) => {
                        if (sku.PACKKEY == valuepack.packkey) {
                            pack = valuepack;
                        }
                    })
                    if (value.uom == pack.packuom2) {
                        if (pack.innerpack == 0 || pack.packuom2 == "") {
                            qtyexpected = value.qtyexpected * 1;
                        }
                        qtyexpected = value.qtyexpected * pack.innerpack;
                    }
                    if (value.uom == pack.packuom3) {
                        qtyexpected = value.qtyexpected * pack.qty;
                    }
                    if (value.uom == pack.packuom4) {
                        qtyexpected = value.qtyexpected * pack.pallet;
                    }

                    value['whseid'] = this.appServices.account.whseid;
                    value['receiptkey'] = this.record_receipt.receiptkey;
                    value['receiptreceiptlinenumber'] = value.receiptlinenumber;
                    value['qtyexpected'] = qtyexpected;
                    value['toloc'] = value['toloc'] !== undefined ? value['toloc'] : "STAGE";
                    value['lpnid'] = (this.record_receipt.receiptkey) + (value.receiptlinenumber);
                    value['storerkey'] = value.storerkey;
                    value['externreceiptkey'] = this.record_receipt.externreceiptkey;
                    value['packkey'] = pack.packkey;
                    value['casecnt'] = pack.casecnt;
                    value['innerpack'] = pack.innerpack;
                    value['pallet'] = pack.pallet;
                    value['type'] = this.record_receipt.receipttype;
                    value['lottable11'] = new Date().toISOString();
                    value['lottable12'] = new Date().toISOString();
                    value['deleted'] = false;
                    value['addwho'] = this.appServices.account.username;
                    value['editwho'] = this.appServices.account.username;
                    value['lottable04'] = this.datepipe.transform(value['lottable04'], 'yyyy-MM-dd');
                    value['lottable05'] = this.datepipe.transform(value['lottable05'], 'yyyy-MM-dd');
                    value['lottable11'] = this.datepipe.transform(value['lottable11'], 'yyyy-MM-dd');
                    value['lottable12'] = this.datepipe.transform(value['lottable12'], 'yyyy-MM-dd');

                    promises.push(new Promise((resolve, reject) => {
                        this.appServices.updateReceiptDetail({ 'obj': JSON.stringify(value) }, this).then((obj) => {
                            resolve();
                        }).catch(function (err) {
                            reject(err);
                        });
                    }));
                } else { }
            });
            Promise.all(promises).then(() => {
                this.notifyService.success('Process Done');
                this.findReceiptData(this.record_receipt);
            }).catch(err => {
                this.notifyService.error(err.err.json().error.message);
            })
        }
    }

    receiveAllData = async () => {
        if (this.data_rowdetail.length == this.data_receiptdetail.length || this.data_rowdetail.length == 0) {
            this.record_receipt['username'] = this.appServices.account.username;
            this.appServices.receiptAll({ 'obj': JSON.stringify(this.record_receipt) }, this).then((res) => {
                this.notifyService.success('Receive Done');
                this.updateStatusReceipt(this.record_receipt)
                this.findReceiptData(this.record_receipt);
            }).catch((err) => {
                this.notifyService.error(err.err.json().error.message);
            })
        } else if (this.data_rowdetail.length > 0) {
            this.appServices.receiptByItem({ 'obj': JSON.stringify(this.data_rowdetail), 'username': this.appServices.account.username }, this).then((res) => {
                this.notifyService.success('Receive Done');
                this.updateStatusReceipt(this.record_receipt)
                this.findReceiptData(this.record_receipt);
            }).catch((err) => {
                this.notifyService.error(err.err.json().error.message);
            })
        }
        this.data_rowdetail = new Array();
    }

    updateStatusReceipt(data) {
        let status;
        data['username'] = this.appServices.account.username
        this.appServices.updateStatusReceipt({ 'obj': JSON.stringify(data) }, this).then((obj) => {
            status = obj.response.json().res;
            if (status == 'New') {
                this.record_receipt.status = 0;
            } else if (status == 'In Receiving') {
                this.record_receipt.status = 5;
            } else if (status == 'Received') {
                this.record_receipt.status = 9;
            }

        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        })
    }


    unReceiptbylpnid = async () => {
        if (this.data_rowdetail.length == this.data_receiptdetail.length || this.data_rowdetail.length == 0) {
            this.record_receipt['username'] = this.appServices.account.username;
            this.appServices.unReceiptAll({ 'obj': JSON.stringify(this.record_receipt) }, this).then((res) => {
                this.notifyService.success('Receive Done');
                this.updateStatusReceipt(this.record_receipt)
                this.findReceiptData(this.record_receipt);
            }).catch((err) => {
                this.notifyService.error(err.err.json().error.message);
            })
        } else if (this.data_rowdetail.length > 0) {
            this.appServices.unReceiptByItem({ 'obj': JSON.stringify(this.data_rowdetail), 'username': this.appServices.account.username }, this).then((res) => {
                this.notifyService.success('Receive Done');
                this.updateStatusReceipt(this.record_receipt)
                this.findReceiptData(this.record_receipt);
            }).catch((err) => {
                this.notifyService.error(err.err.json().error.message);
            })
        }
        this.data_rowdetail = new Array();

    }



    putawayAllData() {
        let storerkey = this.authService.user.strOwners;
        if (this.data_rowdetail.length > 0) {
            let promises = [];
            let el = this.data_rowdetail[0];
            this.data_rowdetail.forEach((valuerow, index, arr) => {
                if (valuerow.statustaskdetail == null) {
                    valuerow['whseid'] = this.appServices.account.whseid;
                    valuerow['username'] = this.appServices.account.username;
                    valuerow['owner'] = storerkey;

                    promises.push(new Promise((resolve, reject) => {
                        this.appServices.putaway({ 'obj': JSON.stringify(valuerow) }, this).then((obj) => {
                            resolve();
                        }).catch(function (err) {
                            reject(err);
                        });
                    }));
                }
            });
            Promise.all(promises).then(() => {
                this.notifyService.success('Done');
                this.findReceiptData(this.record_receipt);
            }).catch(err => {
                this.notifyService.error(err.err.json().error.message);
            })
        } else {
            let promises = [];
            let el = this.data_receiptdetail[0];
            this.data_receiptdetail.forEach((value, index, arr) => {
                if (value.statustaskdetail == null) {
                    value['whseid'] = this.appServices.account.whseid;
                    value['username'] = this.appServices.account.username;
                    value['owner'] = storerkey;
                    promises.push(new Promise((resolve, reject) => {
                        this.appServices.putaway({ 'obj': JSON.stringify(value) }, this).then((obj) => {
                            resolve();
                        }).catch(function (err) {
                            reject(err);
                        });
                    }));
                }
            });
            Promise.all(promises).then(() => {
                this.notifyService.success('Done');
                this.findReceiptData(this.record_receipt);
            }).catch(err => {
                this.notifyService.error(err.err.json().error.message);
            })
        }
        this.data_rowdetail = new Array();
    }

    palletization() {
        let pack;
        let sku;
        let quantity;
        if (this.data_rowdetail.length == 0) {
            this.notifyService.warning("Please select item");
        } else {
            this.data_rowdetail.forEach((value, index, arr) => {
                if (value.status === '' || value.status === '0') {
                    this.data_SKU._data.forEach((valuesku, indexsku, arrsku) => {
                        if (value.sku == valuesku.SKU) {
                            sku = valuesku;
                        }
                    })

                    this.data_pack.forEach((valuepack, indexpack, arrpack) => {
                        if (value.packkey == valuepack.packkey) {
                            pack = valuepack;
                        }
                    })
                    if (!pack.packuom2 || pack.packuom2 != undefined) {
                        if (value.uom == pack.packuom3) {
                            quantity = value.qtyexpected
                        }
                        else {
                            quantity = value.qtyexpected * pack.innerpack;
                        }
                    } else {
                        quantity = value.qtyexpected
                    }

                    if (value.pallet > 0 && quantity > value.pallet) {
                        let oddvalue = quantity % value.pallet;
                        let evenvalue = quantity / value.pallet;
                        let number;
                        let newreceiptlinenumber;
                        let oldqty;

                        for (let i = 0; i < evenvalue - 1; i++) {
                            if (!pack.packuom2 || pack.packuom2 != undefined) {
                                if (value.uom == pack.packuom3) {
                                    value.qtyexpected = value.pallet;
                                }
                                else {
                                    value.qtyexpected = value.pallet / pack.innerpack;
                                    oldqty = value.qtyexpected * pack.innerpack;
                                }
                            } else {
                                value.qtyexpected = value.pallet;
                            }
                            let number = parseInt((value.receiptlinenumber).length) - ((parseInt(value.receiptlinenumber) + (i + 1)).toString()).length;
                            let newreceiptlinenumber = ((value.receiptlinenumber).substring(0, number) + (parseInt(value.receiptlinenumber) + (i + 1)).toString());
                            if (newreceiptlinenumber.length > 5) {
                                newreceiptlinenumber = newreceiptlinenumber.substring(newreceiptlinenumber.length - 5, 5);
                            }
                            let grosswgt = (oldqty) * (sku.STDGROSSWGT)
                            let netwgt = (oldqty) * (sku.STDNETWGT)

                            this.data_receiptdetail.push({
                                'whseid': value.whseid,
                                'receiptkey': value.receiptkey,
                                'receiptlinenumber': newreceiptlinenumber,
                                'sku': value.sku,
                                'lottable04': value.lottable04,
                                'lottable05': value.lottable05,
                                'shelflife': value.shelflife,
                                'uom': value.uom,
                                'qtyexpected': value.qtyexpected,
                                'qtyreceived': value.qtyreceived,
                                'notes': value.notes,
                                'conditioncode': value.conditioncode,
                                'toloc': value.toloc,
                                'grosswgt': grosswgt,
                                'netwgt': netwgt,
                                'storerkey': value.storerkey,
                                'lottable02': value.lottable02,
                                'cube': value.cube,
                                'lottable01': value.lottable01
                            });
                        }
                        // this.data_receiptdetail.forEach((_value, _index, _arr) => {
                        //     _value.receiptlinenumber =  _value.receiptlinenumber.replace(parseInt(_value.receiptlinenumber).toString(), (_index + 1).toString());
                        // })
                        value.qtyexpected = oddvalue;
                        if (oddvalue == 0) {
                            if (!pack.packuom2 || pack.packuom2 != undefined) {
                                if (value.uom == pack.packuom3) {
                                    value.qtyexpected = value.pallet;
                                }
                                else {
                                    value.qtyexpected = value.pallet / pack.innerpack;
                                }
                            } else {
                                value.qtyexpected = value.pallet;
                            }
                        } else {
                            if (!pack.packuom2 || pack.packuom2 != undefined) {
                                if (value.uom == pack.packuom3) {
                                    value.qtyexpected = oddvalue;
                                }
                                else {
                                    value.qtyexpected = oddvalue / pack.innerpack;
                                    value.grosswgt = oddvalue * (sku.STDGROSSWGT);
                                    value.netwgt = oddvalue * (sku.STDNETWGT)
                                }
                            } else {
                                value.qtyexpected = oddvalue;
                            }
                        }
                    }
                } else {
                    if (value.status == '5') {
                        this.notifyService.warning("In Receiving can not update");
                    } else if (value.status == '9') {
                        this.notifyService.warning("Received can not update");
                    }
                }
                value.state = false;
            });
            this.data_rowdetail = new Array();
        }
    }

    deleteReceipt() {
        let promises = [];
        let data = Object.assign({}, this.selected_receipt);
        let counterror = 0;
        if (data.status == "9") {
            this.notifyService.warning("Can not delete");
            counterror++;
        } else if (counterror == 0 && data.status == "0") {
            data['deleted'] = true;
            data['editwho'] = this.appServices.account.username;
            promises.push(new Promise((resolve, reject) => {
                this.appServices.deteleReceipt({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
                    resolve();
                }).catch(function (err) {
                    reject(err);
                });
            }));
            Promise.all(promises).then(() => {
                this.notifyService.success('Done');
                $('#modaldeleteReceipt').modal('hide');
                this.loadReceiptData();
            }).catch(err => {
                this.notifyService.error(err.err.json().error.message);
            })
        }
    }

    deleteDetail(data) {
        data['deleted'] = true;
        data['editwho'] = this.appServices.account.username;
        this.appServices.deleteReceiptDetail({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
            let res = obj.response.json().res;
        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        });
    }


    deleteRowDetail() {
        let promises = [];
        let counterror = 0;
        this.data_rowdetail.forEach((value, index, arr) => {
            if (value.status == "9") {
                this.notifyService.error(" Received could not be delete");
                counterror++;
            } else
                if (counterror == 0 && value.status == "0") {
                    value['deleted'] = true;
                    value['editwho'] = this.appServices.account.username;
                    promises.push(new Promise((resolve, reject) => {
                        this.appServices.updateReceiptDetail({ 'obj': JSON.stringify(value) }, this).then(function (obj) {
                            resolve();
                        }).catch(function (err) {
                            reject(err);
                        });
                    }));
                }
        });
        Promise.all(promises).then(() => {
            this.notifyService.success('Done');
            this.updateStatusReceipt(this.record_receipt)
            this.findReceiptData(this.record_receipt);
        }).catch(err => {
            this.notifyService.error(err.err.json().error.message);
        })
    }

    changeOwner(data) {
        this.loadOneStorerData1(data);
        this.categorySKU(data.storerkey);
        let arraydata = {
            storerkey: data.storerkey,
            receiptlinenumber: ''
        }
        this.initReceiptDetail(arraydata);
        this.data_receiptdetail = [];
        this.loadStatusReceiptdetailData();
    }

    addRow(data) {
        $('#tbldetail').scrollTop(0);
        if (!this.new_receiptdetail.sku) {
            this.notifyService.warning("Expected Sku can not empty");
        } else if (!this.new_receiptdetail.uom) {
            this.notifyService.warning("Expected Uom can not empty");
        } else if (!this.new_receiptdetail.qtyexpected) {
            this.notifyService.warning("Expected Quantity can not empty");
        } else if (this.new_receiptdetail.qtyexpected < 0) {
            this.notifyService.warning("Expected Quantity can not negative real number");
        } else {
            this.data_receiptdetail.unshift(this.new_receiptdetail);
            this.loadUOM1(data.sku);
            let number = parseInt((data.receiptlinenumber).length) - ((parseInt(data.receiptlinenumber) + (1)).toString()).length;
            let newreceiptlinenumber = ((data.receiptlinenumber).substring(0, number) + (parseInt(data.receiptlinenumber) + (1)).toString());
            let arraydata = {
                storerkey: data.storerkey,
                receiptlinenumber: data.receiptlinenumber != "" ? newreceiptlinenumber : '00001'
            }
            this.initReceiptDetail(arraydata);
        }
    }

    initReceipt() {
        this.record_receipt = {
            'receiptkey': 'New',
            'statustext': 'New',
            'type': '',
            'storerkey': '',
            'suppliercode': '',
            'externreceiptkey': '',
            'receiptdate': '',
            'containerkey': '',
            'notes': ''
        };
    }

    initReceiptDetail(data) {
        let receiptlinenumber = data.receiptlinenumber ? data.receiptlinenumber : "00001";
        this.new_receiptdetail = {
            'receiptlinenumber': receiptlinenumber,
            'sku': '',
            'lottable01': '',
            'lottable02': '',
            'shelflife': '',
            'uom': '',
            'qtyexpected': '',
            'qtyreceived': 0,
            'notes': '',
            'status': '',
            'location': '',
            'storerkey': data.storerkey
        };
    }

    categorySKU(data) {
        this.appServices.categorySKU({ 'whseid': this.appServices.account.whseid, 'storerkey': data }, this).then(function (obj) {
            let res = obj.response.json().res;
            obj.component.data_SKU = obj.component.completerService.local(res, 'SKU', 'SKU');
        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        })
    }

    checkAll_Receipt(e) {
        if (e.srcElement.checked) {
            this.data_rowdetail = new Array();
            this.data_receiptdetail.forEach(curr_data => {
                curr_data.state = e.target.checked;
                this.data_rowdetail.push(curr_data);
            })
        } else {
            this.data_receiptdetail.forEach(x => x.state = e.target.checked);
            this.data_rowdetail = [];
        }
    }
    isAllChecked_Receipt() {
        return this.data_receiptdetail.every(_ => _.state);
    }

    onChoose(e, data) {
        if (e.target.checked) {
            this.data_rowdetail.push(data);
        }
        else {
            let index = this.data_rowdetail.indexOf(data);
            this.data_rowdetail.splice(index, 1);
        }
    }

    onChooseReceipt(e, data) {
        if (e.target.checked) {
            this.row_checked.push(data);
        }
        else {
            let index = this.row_checked.indexOf(data);
            this.row_checked.splice(index, 1);
        }
    }

    new() {
        this.initReceipt();
        this.data_receiptdetail = [];
        this.new_receiptdetail = [];
        $(this.tabDetail.nativeElement).tab('show');
    }

    explodeRowDetail() {
        this.data_rowdetail.forEach((value, index, arr) => {
            if (value['status'] === '0' || value['status'] === '') {
                this.appServices.queryBom({ 'whseid': this.appServices.account.whseid, 'deleted': false, 'storerkey': value.storerkey, 'sku': value.sku }, this).then(function (obj) {
                    let res = obj.response.json().res;
                    if (res.length > 0) {
                        for (let i = 0; i < obj.component.data_receiptdetail.length; i++) {
                            if (obj.component.data_receiptdetail[i].receiptlinenumber === value.receiptlinenumber) {
                                obj.component.data_receiptdetail.splice(i, 1);
                                break;
                            }
                        }
                        res.forEach((value_bom, index_bom, arr_bom) => {
                            let number = parseInt((value.receiptlinenumber).length) - ((parseInt(value.receiptlinenumber) + (index_bom + 1)).toString()).length;
                            let newreceiptlinenumber = ((value.receiptlinenumber).substring(0, number) + (parseInt(value.receiptlinenumber) + (index_bom + 1)).toString());
                            obj.component.data_receiptdetail.push({
                                'receiptlinenumber': newreceiptlinenumber,
                                'sku': value_bom.componentsku,
                                'shelflife': value.shelflife,
                                'uom': value_bom.Case,
                                'qtyexpected': value.qtyexpected * value_bom.qty,
                                'qtyreceived': value.qtyreceived,
                                'notes': value.notes,
                                'status': value.status,
                                'location': value.location,
                                'storerkey': value.storerkey
                            });
                        })
                        obj.component.data_receiptdetail.forEach((_value, _index, _arr) => {
                            _value.receiptlinenumber = _value.receiptlinenumber.replace(parseInt(_value.receiptlinenumber).toString(), (_index + 1).toString());
                        })
                    }
                }).catch((err) => {
                    this.notifyService.error(err.err.json().error.message);
                })
            }
        })
        this.data_rowdetail = [];
    }

    doPrintWarehouseReceipt() {
        let storername = '';
        let storer = this.authService.user.owners.find(e => e.storerkey === this.record_receipt.storerkey)
        if (storer) storername = storer.company;
        this.reportService.warehouseReceipt({
            whseid: this.appServices.account.whseid,
            username: this.appServices.account.username,
            receiptkey: this.record_receipt.receiptkey,
            storerkey: this.record_receipt.storerkey,
            storername: storername
        });
    }
    doPrintPutawayList() {
        window.open(`print/putawaylist${this.router.url}/${this.record_receipt.receiptkey}`);
    }
    doPrintPalletLabelDetail() {
        this.reportService.palletLabelDetail({
            whseid: this.appServices.account.whseid,
            username: this.appServices.account.username,
            receiptkey: this.record_receipt.receiptkey,
            storerkey: this.record_receipt.storerkey,
        });
    }

    readCsvData(event) {
        let reader = new FileReader();
        let file = event.target.files[0];
        reader.onload = (e: any) => {
            let value = e.target.result;
            this.content_csv = value;
        };
        reader.readAsText(file);
    }

    loadTaskdetail() {
        let dynamicTabItem: DynamicTabItem = {
            title: 'Taskdetail List',
            component: TaskdetailListComponent,
            data: Object.assign({}, this.record_receipt)
        }
        this.tabEmitter.emit(dynamicTabItem);
    }

    confirmPutaway() {
        let dataconfirm = this.record_receipt;
        dataconfirm['username'] = this.appServices.account.username
        this.appServices.confirmPutaway({ 'obj': JSON.stringify(dataconfirm) }, this).then((obj) => {
            this.notifyService.success(obj);
        }).catch((err) => {
            if (err && err.err) {
                this.notifyService.error(err.err.json().error.message);
            }
        })

    }

    printCartonId() {
        this.notifyService.confirmWithInput('Input quantity').then(value => {
            this.apiService.post('/api/CartonIds/gencartonid', {
                whseid: this.appServices.account.whseid,
                quantity: +value,
            }).then((response) => {
                this.reportService.cartonLabel(response.json().res, this.appServices.account.whseid);
            });
        });
    }

    // UOM
    loadModalUOM(data) {

        if (!data) {
            this.uom_data1 = [];
            this.notifyService.error('please select Item');
        } else {
            $(`#${this.id.uom}`).modal('show');
            this.uom_data1 = [];
            this.loadUOM1(data);
        }
    }
    loadModalUOMRemove(i, id, data) {
        $(`#${this.id.uom}`).modal('show');
        $('#uomedit').val(id);
        $('#indexedit').val(i);
        this.loadUOM1(data);
    }
    getUOM(data) {
        var uomedit = $('#uomedit').val();
        var i = parseInt($('#indexedit').val().toString());
        if (!uomedit) {
            $(`#${this.id.uom}`).modal('hide');
            $('#uom').val(data.description);
            this.new_receiptdetail.uom = data.code;
        } else {
            $(`#${this.id.uom}`).modal('hide');
            $('#' + uomedit + '').val(data.description);
            this.data_receiptdetail[i].uom = data.code
        }
        $('#uomedit').val('')
    }

    // call popupLocationComponent
    private receiptDetail: any;
    @ViewChild('modalLocation') modalLocation: PopupLocationComponent;
    openModalLocation(receiptDetail = null) {
        this.receiptDetail = receiptDetail;
        this.modalLocation.openModal();
    }
    selectlocation(data) {
        if (!this.receiptDetail) {//new
            this.new_receiptdetail.toloc = data.loc;
        } else {//edit
            this.receiptDetail.toloc = data.loc;
        };
    }

    @ViewChild('modalSKU') childsku: PopupSKUComponent;
    
    openModalSKU(receiptDetail = null) {
        this.receiptDetail = receiptDetail;
        if (this.record_receipt.storerkey) {
            this.childsku.open({
                storerkey: this.record_receipt.storerkey
            });
        }
        else {
            this.notifyService.error('please select Owner');
        }
    }
    selectsku(data) {
        if (!this.receiptDetail) {//new
            this.new_receiptdetail.sku = data.sku;
        } else {//edit
            this.receiptDetail.sku = data.sku;
        }
    }

    @ViewChild('modalCheckin') childcheckin: PopupCheckinComponent;
    private receipt: any;
    openModalCheckin(receipt = null) {
        this.receipt = receipt;
        this.childcheckin.open({
            storerkey: this.record_receipt.storerkey
        });
    }
    selectcheckin(data) {
        if (!this.record_receipt) {//new
            this.record_receipt.containerkey = data.truckno;
        } else {//edit
            this.record_receipt.containerkey = data.truckno;
        }
    }

}
