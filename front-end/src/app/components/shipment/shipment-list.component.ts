import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from '../../notify.service';
import { PasteService } from './../../paste.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { CompleterService, CompleterData } from 'ng2-completer';
import { DatePipe } from '@angular/common';
import { PopupSKUComponent } from '../../common/popup-sku/popup-sku.component';
import { PopupCheckinComponent } from '../../common/popup-checkin/popup-checkin.component';
import { PopupShipcodeComponent } from '../../common/popup-shipcode/popup-shipcode.component';

import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { log } from 'util';
import * as uuid from 'uuid';
import * as $ from 'jquery';
import 'bootstrap';
import { GridOption } from '../../common/grid-control/grid-control';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { SocketService, ISocketData } from '../../services/socket.service';
import { AllocatemanualComponent } from '../allocatemanual/allocatemanual.component';
import { ReportService } from '../../services/report.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { UtilityService } from '../../services/utility-service/utility.service';

type AOA = Array<Array<any>>;
@Component({
  selector: 'app-shipment-list',
  templateUrl: './shipment-list.component.html',
  styleUrls: ['./shipment-list.component.css']
})
export class ShipmentListComponent implements OnInit, DynamicComponent {

  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();


  @ViewChild('grid') grid: GridControlComponent;
  @ViewChild('tabDetail') tabDetail: ElementRef;
  @ViewChild('tabpickdetail') el_tabpickdetail: ElementRef;
  data_shipment; data_replay; selected_shipment; selected_shipmentrow; record_shipment; selected_order; data_item;
  data_shipmentdetail; new_shipmentdetail; select_data_shipmentdetail; data_totalDetail;
  data_owner; data_customer; data_carriercode; data_uom; data_uom1; data_uom2; data_uom3; data_lot; data_SKU; data_pack; data_codelkup; packkey; listorders; datasku;
  count_shipment = 0;
  delete_shipment = [];
  count_shipmentdetail = 0;
  delete_shipment_detail = [];
  data_rowdetail = [];
  data_ordertype = [];
  data_storer = [];
  total_shipment = 0; currentPage_shipment = 1; itemsPerPage_shipment = 12; data_itemsPerPage = [];
  total_shipmentDetail = 0; itemsPerPage_shipmentDetail = 12; currentPage_shipmentDetail = 1;
  total_detail = 0; currentPage_detail = 1; itemsPerPage_detail = 5;
  total_pick = 0; currentPage_pick = 1; itemsPerPage_pick = 5;
  filter; filterPick; data_pickdetail; data_pick; data_rowpick = [];
  data_masterpick; isMasterPick = false; flag = false;
  f_whseid = ''; f_orderkey = ''; f_status = ''; f_storerkey = ''; f_voyagecode = ''; f_externorderkey = ''; f_susr1 = ''; f_susr5 = ''; f_deliverydate = '';
  f_sku = ''; f_descr = '';
  propertyName; order = 'ASC';
  headers = []; data_row_excel = []; lines; data_headers = []; dataExcel_Shipment
  id = {
    tabDetail: uuid.v4(),
    uom: uuid.v4()
  }
  socketSubcription: any;
  constructor(
    private router: Router,
    public authService: AuthService,
    private appServices: AppServices,
    private notifyService: NotifyService,
    private pasteService: PasteService,
    private completerService: CompleterService,
    private datepipe: DatePipe,
    private socketService: SocketService,
    private reportService: ReportService,
    private utilityService: UtilityService) {
  }
  ngOnInit() {
    $('body').off('paste');
    this.initShipment();
    this.loadShipmentData();
    // this.getItemsPerPage();
    this.loadOrderData();
    this.loadStorerData();
    this.loadOrderTypeData();
    this.loadCustomerData();
    this.loadCarrierCodeData();
    this.loadOnePackData();
    this.loadCodelkupData();
    this.loadMasterPickData();
    this.socketSubcription = this.socketService.emitter.subscribe((socketData: ISocketData) => {
      if (socketData.code === "ORDER_CREATE" || socketData.code === "ORDER_UPDATE" || socketData.code === "ORDER_DELETE") {
        this.updateStatusOrder(this.record_shipment);
        this.findOrderData(this.record_shipment);
      }
    });
  }


  onFileChange(evt: any) {
    this.data_row_excel = [];
    let data = undefined
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      let headers = data[0];
      if (headers[0] == 'OWNER' && headers[2] == 'CUSTOMER' && headers[5] == 'SONO' && headers[8] == 'ITEMCODE') {
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
            this.data_row_excel.forEach(ex => {
              ex['storerkey'] = ex.OWNER;
              ex['type'] = ex.TYPE;
              ex['status'] = "04";
              ex['consigneekey'] = ex.CUSTOMER;
              ex['carriercode'] = ex.CARRIERCODE;
              ex['shipcode'] = ex.SHIPTO;
              ex['externorderkey'] = ex.SONO;
              ex['susr1'] = ex.CONTAINER;
              ex['notes'] = ex.REMARK;
              ex['sku'] = ex.ITEMCODE;
              ex['uom'] = ex.UOM;
              ex['openqty'] = ex.ORDERQUANTITY;
              ex['susr4'] = ex.VALIDATEDQUANTITY;
              ex['unitprice'] = ex.UNITPRICE;
              ex['lottable01'] = ex.LOTTABLE01;
              ex['lottable02'] = ex.LOTTABLE02;
              ex['lottable03'] = ex.LOTTABLE03;
              ex['lottable04'] = ex.LOTTABLE04;
              ex['lottable05'] = ex.LOTTABLE05;
              ex['discount'] = ex.DISCOUNT;
              ex['vat'] = ex.VAT;
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
      } else {
        this.notifyService.error('Template incorrect');
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
    this.dataExcel_Shipment = arr;
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
    this.groupBy(this.data_row_excel, function (item) { return [item.SONO]; });
    promises.push(new Promise((resolve, reject) => {
      this.appServices.insertExcelOrder({ 'obj': JSON.stringify(this.dataExcel_Shipment) }, this)
        .then((obj) => {
          resolve();
        }).catch(function (err) {
          reject(err);
        });
    }));
    Promise.all(promises).then(() => {
      this.notifyService.success('Done');
      this.loadShipmentData();
    }).catch(err => {
      this.notifyService.error(err.err.json().error.message);
    })
  }


  export() {
    var ws = XLSX.utils.json_to_sheet(this.data_shipment);
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

  loadShipmentData(param?: Object) {
    let skip = (this.currentPage_shipment - 1) * this.itemsPerPage_shipment;
    let limit = this.itemsPerPage_shipment;
    let filter;
    if (param) {
      if (this.f_whseid.length > 0) filter = $.extend(filter, { 'whseid like': this.f_whseid });
      if (this.f_orderkey.length > 0) filter = $.extend(filter, { 'orderkey like': this.f_orderkey });
      if (this.f_status.length > 0) filter = $.extend(filter, { 'status like': this.f_status });
      if (this.f_storerkey.length > 0) filter = $.extend(filter, { 'storerkey like': this.f_storerkey });
      if (this.f_externorderkey.length > 0) filter = $.extend(filter, { 'externorderkey like': this.f_externorderkey });
      if (this.f_susr1.length > 0) filter = $.extend(filter, { 'susr1 like': this.f_susr1 });
      if (this.f_susr5.length > 0) filter = $.extend(filter, { 'susr5 like': this.f_susr5 });
      if (this.f_deliverydate.length > 0) filter = $.extend(filter, { 'deliverydate like': this.f_deliverydate });
    }
    let storerkey = this.appServices.account.strOwners;
    this.appServices.listOrders({ 'obj': JSON.stringify({ 'whseid': this.appServices.account.whseid, 'deleted': false, storerkey: storerkey, 'skip': skip, 'limit': limit, 'order': this.propertyName ? this.propertyName + " " + this.order : null }), 'filter': JSON.stringify(filter) }, this)
      .then(function (obj) {
        let json = obj.response.json();
        obj.component.data_shipment = json.res;
        obj.component.total_shipment = json.total;

      }).catch((err) => {
        this.notifyService.error(err.err.json().error.message);
      })
  }



  loadPickDetail(param?: Object, data?, flagPick?) {
    this.flag = flagPick;
    if (this.flag == true) {
      this.el_tabpickdetail.nativeElement.click();
      let skip = (this.currentPage_pick - 1) * this.itemsPerPage_pick;
      let limit = this.itemsPerPage_pick;
      if (param) {
        this.filterPick = $.extend(this.filterPick, param);
        let paramIndex = Object.keys(this.filterPick).indexOf(Object.keys(param)[0]);
        if (!(Object.values(this.filterPick)[paramIndex]).like) {
          delete this.filterPick[Object.keys(param)[0]];
        }
      }
      let str = { 'whseid': this.appServices.account.whseid, 'orderkey': data.orderkey, 'deleted': false }
      this.appServices.getPickdetail(str, this).then((obj) => {
        let json = obj.response.json();
        this.data_pick = json.res;
        this.total_pick = json.total;
      }).catch((err) => {
        this.notifyService.error(err.err.json().error.message);
      })
      this.flag = false;
    }

  }

  loadPickDetailtab(param?: Object) {
    if (this.flag == false) {
      let skip = (this.currentPage_pick - 1) * this.itemsPerPage_pick;
      let limit = this.itemsPerPage_pick;
      if (param) {
        this.filterPick = $.extend(this.filterPick, param);
        let paramIndex = Object.keys(this.filterPick).indexOf(Object.keys(param)[0]);
        if (!(Object.values(this.filterPick)[paramIndex]).like) {
          delete this.filterPick[Object.keys(param)[0]];
        }
      }
      let str = { 'whseid': this.appServices.account.whseid, 'deleted': false }

      this.appServices.getPickdetail(str, this).then(function (obj) {
        let json = obj.response.json();
        obj.component.data_pick = json.res;
        obj.component.total_pick = json.total;
      }).catch((err) => {
        this.notifyService.error(err.err.json().error.message);
      })
    }

  }

  loadOrderData() {
    this.appServices.getlistOrders({ 'whseid': this.appServices.account.whseid, 'deleted': false }, this).then(function (obj) {
      obj.component.listorders = obj.response.json().res;
    }).catch((err) => {
      this.notifyService.error(err.err.json().error.message);
    })
  }
  loadMasterPickData() {
    this.appServices.listMasterPick({ 'whseid': this.appServices.account.whseid }, this).then(function (obj) {
      obj.component.data_masterpick = obj.response.json().res;
    }).catch((err) => {
      this.notifyService.error(err.err.json().error.message);
    })
  }
  loadStorerData() {
    this.appServices.getlistStorer({ 'whseid': this.appServices.account.whseid, 'type': "1", 'deleted': false }, this)
      .then(obj => {
        this.data_storer = obj.response.json().res;
      }).catch((err) => {
        this.utilityService.handleError(err);
      })
  }
  loadOrderTypeData() {
    this.appServices.getlistCodelkup({ 'whseid': this.appServices.account.whseid, 'listname': 'ORDERTYPE', 'deleted': false, 'skip': 0 }, this)
      .then(obj => {
        this.data_ordertype = obj.response.json().res;
      }).catch(err => {
        this.utilityService.handleError(err);
      })
  }
  loadCustomerData() {
    this.appServices.getlistStorer({ 'whseid': this.appServices.account.whseid, 'type': "2", 'deleted': false }, this)
      .then(obj => {
        this.data_customer = obj.response.json().res;
      }).catch((err) => {
        this.utilityService.handleError(err);
      })
  }
  loadCarrierCodeData() {
    this.appServices.getlistStorer({ 'whseid': this.appServices.account.whseid, 'type': "3", 'deleted': false }, this).then(function (obj) {
      obj.component.data_carriercode = obj.response.json().res;
    }).catch((err) => {
      this.utilityService.handleError(err);
    })
  }
  loadOnePackData() {
    this.appServices.listPack({ 'whseid': this.appServices.account.whseid, 'deleted': false, 'skip': 0 }, this).then(function (obj) {
      obj.component.data_pack = obj.response.json().res;
    }).catch((err) => {
      this.utilityService.handleError(err);
    })
  }
  getSKU(data) {
    this.appServices.getsku({ 'whseid': this.appServices.account.whseid, "storerkey": data.storerkey, 'deleted': false }, this).then(function (obj) {
      obj.component.datasku = obj.response.json().res;
    }).catch((err) => {
      this.utilityService.handleError(err);
    })
  }

  totaldetail(data) {
    this.appServices.totaldetail({ 'obj': JSON.stringify(data) }, this).then((obj) => {
      this.data_totalDetail = obj.response.json().res;
      this.record_shipment['totalqty'] = this.data_totalDetail.totalqty;
      this.record_shipment['totalqtyAll'] = this.data_totalDetail.totalqtyAll;
      this.record_shipment['totalqtyPicked'] = this.data_totalDetail.totalqtyPicked;
      this.record_shipment['totalqtyShiped'] = this.data_totalDetail.totalqtyShiped;
    }).catch((err) => {
      this.utilityService.handleError(err);
    })
  }

  loadUOM(data) {
    if (data != undefined) {
      this.data_SKU._data.forEach((value, index, arr) => {
        if (value.SKU == data) {
          this.packkey = value.PACKKEY;
        }
      })
      this.appServices.getUOM({ 'whseid': this.appServices.account.whseid, 'packkey': this.packkey, 'deleted': false, 'skip': 0 }, this).then(function (obj) {
        obj.component.data_uom = obj.response.json().res;
      }).catch((err) => {
        this.utilityService.handleError(err);
      })
    }
  }

  removeOption(id, data) {
    this.loadOtherUOM(id, data);
  }

  onkey(event: any) {
    if (event.key == 'Enter') {
      $('listItem').on('click', function (e) {
        e.preventDefault();
      });
    }
  }

  loadOtherUOM(id, data) {
    if (this.data_SKU) {
      if (data != undefined) {
        this.data_SKU._data.forEach((value, index, arr) => {
          if (value.SKU == data) {
            this.packkey = value.PACKKEY;
          }
        })
        this.appServices.getOtherUOM({ 'obj': JSON.stringify({ 'whseid': this.appServices.account.whseid, 'packkey': this.packkey, 'deleted': false, 'skip': 0 }) }, this).then(function (obj) {
          obj.component.data_uom3 = obj.response.json().res;
          obj.component.data_uom3.forEach(v => {
            $("#" + id + " option[ng-reflect-ng-value='" + v.code + "']").remove();
          });
        }).catch((err) => {
          this.utilityService.handleError(err);
        })
      }
    }
  }

  loadUOMTest(data) {
    if (this.data_SKU) {
      if (data != undefined) {
        this.data_SKU._data.forEach((value, index, arr) => {
          if (value.SKU == data) {
            this.packkey = value.PACKKEY;
          }
        })
        this.appServices.getUOM({ 'whseid': this.appServices.account.whseid, 'packkey': this.packkey, 'deleted': false, 'skip': 0 }, this).then(function (obj) {
          obj.component.data_uom2 = obj.response.json().res;
        }).catch((err) => {
          this.utilityService.handleError(err);
        })
      }
    }
  }

  // loadUOM1(data) {
  //   if (this.data_SKU) {
  //     if (data != undefined) {
  //       this.data_SKU._data.forEach((value, index, arr) => {
  //         if (value.SKU == data) {
  //           this.packkey = value.PACKKEY;
  //         }
  //       })
  //       this.appServices.getUOM({ 'whseid': this.appServices.account.whseid, 'packkey': this.packkey, 'deleted': false, 'skip': 0 }, this).then(function (obj) {
  //         obj.component.data_uom1 = obj.response.json().res;
  //       }).catch((err) => {
  //         this.notifyService.error(err.err.json().error.message);
  //       })
  //     }
  //   }
  // }

  dataPack = {};
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
            this.data_uom1 = Object.assign([], this.dataPack[this.packkey].response.json().res);
          } else {
            this.dataPack[this.packkey] = await this.appServices.getUOM({ 'whseid': this.appServices.account.whseid, 'packkey': this.packkey, 'deleted': false, 'skip': 0 }, this);
            this.data_uom1 = Object.assign([], this.dataPack[this.packkey].response.json().res);
          }
        }
        catch (e) {
          this.utilityService.handleError(e);
        }
      }
    }
  }

  loadAllUOM() {
    this.appServices.getAllUOM({ 'obj': JSON.stringify({ 'whseid': this.appServices.account.whseid, 'deleted': false, 'skip': 0 }) }, this).then(function (obj) {
      obj.component.data_uom1 = obj.response.json().res;
    }).catch((err) => {
      this.utilityService.handleError(err);
    })
  }

  loadCodelkupData() {
    this.appServices.getlistCodelkup({ 'whseid': this.appServices.account.whseid, 'listname': "ORDERSTATUS", 'deleted': false, 'skip': 0 }, this).then(function (obj) {
      obj.component.data_codelkup = obj.response.json().res;
    }).catch((err) => {
      this.utilityService.handleError(err);
    })
  }
  loadLottable_Data(data) {
    let filter = JSON.stringify({ "where": { "whseid": this.appServices.account.whseid, "storerkey": data.storerkey, "type": "1", "deleted": false } });
    this.appServices.findStorer({ filter }, this).then(function (obj) {
      obj.component.data_owner = obj.response.json().res;
      obj.component.data_lot = JSON.parse(obj.component.data_owner[0].lottable);
    }).catch((err) => {
      this.utilityService.handleError(err);
    })
  }
  loadLottable_Data1(data) {
    let dataOwner = this.appServices.account.owners;
    this.appServices.account.owners.forEach((value, index, arr) => {
      if (value.storerkey == data.storerkey) {
        this.data_owner = value;
        let json = JSON.parse(value.lottable);
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

  _loadOrderDetailData(data) {
    let skip = (this.currentPage_shipmentDetail - 1) * this.itemsPerPage_shipmentDetail;
    let limit = this.itemsPerPage_shipmentDetail;
    let filter;
    let pack;
    let sku;
    let openqty;
    let originalqty;
    let qtyallocated;
    let qtypicked;
    let shippedqty;
    if (skip == 0) {
      this.data_shipmentdetail = [];
      this.count_shipmentdetail = skip;
    }
    this.changeOwner(data);
    this.appServices.listOrdersDetail({ 'whseid': this.appServices.account.whseid, 'orderkey': data.orderkey, 'deleted': false }, this)
      .then(function (obj) {
        let json = obj.response.json();
        if (obj.component.data_shipmentdetail) {
          obj.component.data_shipmentdetail = obj.component.data_shipmentdetail.concat(json.res);
        }
        else {
          obj.component.data_shipmentdetail = json.res;
        }
        obj.component.total_shipmentDetail = json.total;
        let arraydata;
        if (obj.component.data_shipmentdetail.length > 0) {
          obj.component.data_shipmentdetail.forEach((value, index, arr) => {
            obj.component.loadAllUOM();
            obj.component.data_pack.forEach((valuepack, indexpack, arrpack) => {
              if (value.packkey == valuepack.packkey) {
                pack = valuepack;
              }
            })
            if (value.uom == pack.packuom2) {
              if (pack.innerpack == 0 || pack.packuom2 == "") {
                openqty = value.openqty / 1;
                originalqty = value.originalqty / 1;
                qtyallocated = value.qtyallocated / 1;
                qtypicked = value.qtypicked / 1;
                shippedqty = value.shippedqty / 1
              }
              openqty = value.openqty / pack.innerpack;
              originalqty = value.originalqty / pack.innerpack;
              qtyallocated = value.qtyallocated / pack.innerpack;
              qtypicked = value.qtypicked / pack.innerpack;
              shippedqty = value.shippedqty / pack.innerpack;
            }
            if (value.uom == pack.packuom3) {
              openqty = value.openqty / pack.qty;
              originalqty = value.originalqty / pack.qty;
              qtyallocated = value.qtyallocated / pack.qty;
              qtypicked = value.qtypicked / pack.qty;
              shippedqty = value.shippedqty / pack.qty;
            }
            if (value.uom == pack.packuom4) {
              openqty = value.openqty / pack.pallet;
              originalqty = value.originalqty / pack.pallet;
              qtyallocated = value.qtyallocated / pack.pallet;
              qtypicked = value.qtypicked / pack.pallet;
              shippedqty = value.shippedqty / pack.pallet;
            }
            value.openqty = openqty;
            value.originalqty = originalqty;
            value.qtyallocated = qtyallocated;
            value.qtypicked = qtypicked;
            value.shippedqty = shippedqty;
            value.lottable04 = obj.component.datepipe.transform(value.lottable04, "yyyy-MM-dd");
            value.lottable05 = obj.component.datepipe.transform(value.lottable05, "yyyy-MM-dd");
            value.lottable11 = obj.component.datepipe.transform(value.lottable11, "yyyy-MM-dd");
            value.lottable12 = obj.component.datepipe.transform(value.lottable12, "yyyy-MM-dd");
          })

          let length = obj.component.data_shipmentdetail.length;
          let countlinenumber = obj.component.data_shipmentdetail[length - 1].orderlinenumber;
          let orderlinenumber = countlinenumber.replace(parseInt(countlinenumber).toString(), (parseInt(countlinenumber) + 1).toString());

          arraydata = {
            storerkey: data.storerkey,
            orderlinenumber: orderlinenumber
          }
        }
        else {
          arraydata = {
            storerkey: data.storerkey,
            orderlinenumber: ''
          }
        }
        obj.component.initShipmentDetail(arraydata);
      }).catch((err) => {
        this.utilityService.handleError(err);
      })
  }


  loadOrderDetailData = async (data) => {
    try {
      let skip = (this.currentPage_shipmentDetail - 1) * this.itemsPerPage_shipmentDetail;
      let limit = this.itemsPerPage_shipmentDetail;
      let filter;
      let pack;
      let sku;
      let openqty;
      let originalqty;
      let qtyallocated;
      let qtypicked;
      let shippedqty;
      let countOrder = [];
      if (skip == 0) {
        this.data_shipmentdetail = [];
        this.count_shipmentdetail = skip;
      }
      this.changeOwner(data);
      let obj = await this.appServices.listOrdersDetail({ 'whseid': this.appServices.account.whseid, 'orderkey': data.orderkey, 'deleted': false }, this)
      let json = obj.response.json();
      if (this.data_shipmentdetail) {
        this.data_shipmentdetail = this.data_shipmentdetail.concat(json.res);
      }
      else {
        this.data_shipmentdetail = json.res;
      }
      this.total_shipmentDetail = json.total;
      let arraydata;
      if (this.data_shipmentdetail.length > 0) {
        for (let index = 0; index < this.data_shipmentdetail.length; index++) {
          let value = this.data_shipmentdetail[index];
          let arr = this.data_shipmentdetail;

          this.data_pack.forEach((valuepack, indexpack, arrpack) => {
            if (value.packkey == valuepack.packkey) {
              pack = valuepack;
            }
          })
          if (value.uom == pack.packuom2) {
            if (pack.innerpack == 0 || pack.packuom2 == "") {
              openqty = value.openqty / 1;
              originalqty = value.originalqty / 1;
              qtyallocated = value.qtyallocated / 1;
              qtypicked = value.qtypicked / 1;
              shippedqty = value.shippedqty / 1
            }
            openqty = value.openqty / pack.innerpack;
            originalqty = value.originalqty / pack.innerpack;
            qtyallocated = value.qtyallocated / pack.innerpack;
            qtypicked = value.qtypicked / pack.innerpack;
            shippedqty = value.shippedqty / pack.innerpack;
          }
          if (value.uom == pack.packuom3) {
            openqty = value.openqty / pack.qty;
            originalqty = value.originalqty / pack.qty;
            qtyallocated = value.qtyallocated / pack.qty;
            qtypicked = value.qtypicked / pack.qty;
            shippedqty = value.shippedqty / pack.qty;
          }
          if (value.uom == pack.packuom4) {
            openqty = value.openqty / pack.pallet;
            originalqty = value.originalqty / pack.pallet;
            qtyallocated = value.qtyallocated / pack.pallet;
            qtypicked = value.qtypicked / pack.pallet;
            shippedqty = value.shippedqty / pack.pallet;
          }
          value.openqty = openqty;
          value.originalqty = originalqty;
          value.qtyallocated = qtyallocated;
          value.qtypicked = qtypicked;
          value.shippedqty = shippedqty;
          value.lottable04 = this.datepipe.transform(value.lottable04, "yyyy-MM-dd");
          value.lottable05 = this.datepipe.transform(value.lottable05, "yyyy-MM-dd");
          value.lottable11 = this.datepipe.transform(value.lottable11, "yyyy-MM-dd");
          value.lottable12 = this.datepipe.transform(value.lottable12, "yyyy-MM-dd");
          await this.loadUOM1(value.sku);
        }
        let length = this.data_shipmentdetail.length;
        let countlinenumber = this.data_shipmentdetail[length - 1].orderlinenumber;
        let orderlinenumber = countlinenumber.replace(parseInt(countlinenumber).toString(), (parseInt(countlinenumber) + 1).toString());

        arraydata = {
          storerkey: data.storerkey,
          orderlinenumber: orderlinenumber
        }
      } else {
        arraydata = {
          storerkey: data.storerkey,
          receiptlinenumber: ''
        }
      }
      this.initShipmentDetail(arraydata);
    }
    catch (e) {
      this.utilityService.handleError(e);
    }
  }



  saveOrderData(data) {
    let counterror = 0;
    let flag;
    this.listorders.forEach((valueshipment, indexshipment, arrshipment) => {
      if (data.externorderkey == valueshipment.EXTERNORDERKEY) {
        flag = false;
      }
      if (indexshipment == arrshipment.length - 1) {
        if (flag == false) {
          this.notifyService.warning("SO No existed");
        }
      }
    })
    if (this.data_shipmentdetail.length >= 0) {
      this.data_shipmentdetail.forEach((value, index, arr) => {
        if (value.sku == "") {
          this.notifyService.warning("Linenumber " + value.orderlinenumber + " Sku can not empty");
          counterror++;
        } else if (value.uom == "") {
          this.notifyService.warning("Linenumber " + value.orderlinenumber + " Uom can not empty");
          counterror++;
        } else if (value.openqty == "") {
          this.notifyService.warning("Linenumber " + value.orderlinenumber + " Openqty can not empty");
          counterror++;
        } else if (value.lottable04 > value.lottable05) {
          this.notifyService.warning("Product date can not be greater than expiry date.");
          counterror++;
        } else if (value.status == '' && data.status != undefined || value.status == '0' && data.status != undefined) {
          counterror = 0;
        }
      })
      if (counterror == 0) {
        if (data['id'] === null || typeof data['id'] === 'undefined') {
          this.insertOrderData(data);
          this.loadShipmentData();
        } else {

          this.updateOrderData(data);
          this.loadShipmentData();
        }
      }
    }
  }

  insertOrderData(data) {
    let promises = [];
    data['whseid'] = this.appServices.account.whseid;
    data['status'] = "04";
    data['deleted'] = false;
    data['provisiondate'] = this.datepipe.transform(data['provisiondate'], 'yyyy-MM-dd');
    data['addwho'] = this.appServices.account.username;
    data['editwho'] = this.appServices.account.username;
    this.generate();
    data['orderdetails'] = this.data_shipmentdetail;
    this.appServices.createOrder({ 'obj': data }, this).then((obj) => {
      let res = obj.response.json();
      this.notifyService.success('Create Done');
      this.findOrderData(res)
    }).catch(function (err) {
      this.utilityService.handleError(err);
    });
  }

  generate() {
    let pack;
    let sku;
    let openqty;
    this.data_shipmentdetail.forEach((value, index, arr) => {
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
          openqty = value.openqty * 1;
        }
        openqty = value.openqty * pack.innerpack;
      }
      if (value.uom == pack.packuom3) {
        openqty = value.openqty * pack.qty;
      }
      if (value.uom == pack.packuom4) {
        openqty = value.openqty * pack.pallet;
      }
      let stdcube = (openqty) * (sku.STDCUBE)
      let stdgrosswgt = (openqty) * (sku.STDGROSSWGT)
      let stdnetwgt = (openqty) * (sku.STDNETWGT)
      value.openqty = openqty;
      value['cube'] = (openqty) * (sku.STDCUBE);
      value['grosswgt'] = (openqty) * (sku.STDCUBE);
      value['netwgt'] = (openqty) * (sku.STDNETWGT);
      value['packkey'] = pack.packkey;
      value['pallet'] = pack.pallet;
      value['innerpack'] = pack.innerpack;
      value['casecnt'] = pack.casecnt;
      value['deleted'] = false;
      value['lottable04'] = this.datepipe.transform(value['lottable04'], 'yyyy-MM-dd');
      value['lottable05'] = this.datepipe.transform(value['lottable05'], 'yyyy-MM-dd');
      value['lottable11'] = this.datepipe.transform(value['lottable11'], 'yyyy-MM-dd');
      value['lottable12'] = this.datepipe.transform(value['lottable12'], 'yyyy-MM-dd');
    })
  }

  findOrderData(data) {
    // this.el.nativeElement.click();
    $(this.tabDetail.nativeElement).tab('show');
    this.record_shipment = data
    this.totaldetail(this.record_shipment);
    this.loadOrderDetailData(this.record_shipment);
    this.loadLottable_Data1(this.record_shipment);
    this.loadStorerData();
    this.loadCarrierCodeData();
  }

  updateOrderData(data) {
    let promises = [];
    data['whseid'] = this.appServices.account.whseid;
    data['status'] = data.status;
    data['deleted'] = false;
    data['addwho'] = this.appServices.account.username;
    data['editwho'] = this.appServices.account.username;
    this.generate();
    data['orderdetails'] = this.data_shipmentdetail;
    this.appServices.updateOrders({ 'obj': data }, this).then((obj) => {
      this.notifyService.success('Update Done');
      this.findOrderData(this.record_shipment);
    }).catch(function (err) {
      this.notifyService.error(err.err.json().error.message);
    });

  }



  updateOrderDetailtData() {
    let promises = [];
    let data = this.data_shipmentdetail;
    let dataLot = this.data_lot;
    let arrlottable;
    let pack;
    let sku;
    let openqty;
    if (data) {
      this.data_shipmentdetail.forEach((value, index, arr) => {
        if (value.status == undefined || value.status == '04' || value.status == '') {
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
              openqty = value.openqty * 1;
            }
            openqty = value.openqty * pack.innerpack;
          }
          if (value.uom == pack.packuom3) {
            openqty = value.openqty * pack.qty;
          }
          if (value.uom == pack.packuom4) {
            openqty = value.openqty * pack.pallet;
          }
          value['whseid'] = this.appServices.account.whseid;
          value['orderkey'] = this.record_shipment.orderkey;
          value['orderlinenumber'] = value.orderlinenumber;
          value['openqty'] = openqty;
          value['lpnid'] = (this.record_shipment.orderkey) + (value.orderlinenumber);
          value['storerkey'] = value.storerkey;
          value['externorderkey'] = this.record_shipment.externorderkey;
          value['packkey'] = pack.packkey;
          value['type'] = this.record_shipment.ordertype;
          value['deleted'] = false;
          value['addwho'] = this.appServices.account.username;
          value['editwho'] = this.appServices.account.username;
          value['lottable04'] = this.datepipe.transform(value['lottable04'], 'yyyy-MM-dd');
          value['lottable05'] = this.datepipe.transform(value['lottable05'], 'yyyy-MM-dd');
          value['lottable11'] = this.datepipe.transform(value['lottable11'], 'yyyy-MM-dd');
          value['lottable12'] = this.datepipe.transform(value['lottable12'], 'yyyy-MM-dd');

          promises.push(new Promise((resolve, reject) => {
            this.appServices.updateOrdersDetail({ 'obj': JSON.stringify(value) }, this).then((obj) => {
              resolve();
            }).catch(function (err) {
              reject(err);
            });
          }));
        } else { }
      });
      Promise.all(promises).then(() => {
        this.notifyService.success('Process Done');
        this.findOrderData(this.record_shipment);
      }).catch(err => {
        this.utilityService.handleError(err);
      })
    }
  }

  updateStatusOrder(data) {
    let status;
    data['username'] = this.appServices.account.username
    this.appServices.updateStatusOrder({ 'obj': JSON.stringify(data) }, this).then((obj) => {
      status = obj.response.json().res;
      if (status == 'New') {
        this.record_shipment.status = '04';
      } else if (status == 'Part Allocate') {
        this.record_shipment.status = 14;
      } else if (status == 'Allocated') {
        this.record_shipment.status = 17;
      } else if (status == 'Part Pick') {
        this.record_shipment.status = 52;
      } else if (status == 'Picked') {
        this.record_shipment.status = 55;
      } else if (status == 'Part Ship') {
        this.record_shipment.status = 92;
      } else if (status == 'Shipped') {
        this.record_shipment.status = 95;
      }
    }).catch((err) => {
      this.notifyService.error(err.err.json().error.message);
    })
  }


  

  allocateAllData() {
    if (this.data_rowdetail.length > 0) {
      let promises = [];
      let el = this.data_rowdetail[0];
      this.data_rowdetail.forEach((valuerow, index, arr) => {
        if (valuerow.status == '04' || valuerow.status == '14') {
          valuerow['whseid'] = this.appServices.account.whseid;
          valuerow['username'] = this.appServices.account.username;
          promises.push(new Promise((resolve, reject) => {
            this.appServices.orderAllocateByStratugy({ 'whseid': this.appServices.account.whseid, 'storerkey': valuerow.storerkey, 'orderkey': valuerow.orderkey, 'orderlinenumber': valuerow.orderlinenumber, 'username': this.appServices.account.username}, this).then((obj) => {
              resolve();
            }).catch(function (err) {
              reject(err);
            });
          }));
        }
      });
      Promise.all(promises).then(() => {
        this.notifyService.success('Done');
        this.updateStatusOrder(this.record_shipment);
        this.findOrderData(this.record_shipment);
      }).catch(err => {
        this.utilityService.handleError(err);
      })
    } else {

      this.notifyService.success('please select item');
      // let promises = [];
      // let el = this.data_shipmentdetail[0];
      // this.data_shipmentdetail.forEach((value, index, arr) => {
      //   if (value.status == '04' || value.status == '14') {
      //     value['whseid'] = this.appServices.account.whseid;
      //     value['username'] = this.appServices.account.username;
      //     promises.push(new Promise((resolve, reject) => {
      //       this.appServices.allocatebystrategy({ 'obj': JSON.stringify(value) }, this).then((obj) => {
      //         resolve();
      //       }).catch(function (err) {
      //         reject(err);
      //       });
      //     }));
      //   }
      // });
      // Promise.all(promises).then(() => {
      //   this.notifyService.success('Done');
      //   this.updateStatusOrder(this.record_shipment);
      //   this.findOrderData(this.record_shipment);
      // }).catch(err => {
      //   if (err && err.err) {
      //     this.notifyService.error(err.err.json().error.message);
      //   }
      // })
    }
    this.data_rowdetail = new Array();
  }


  unAllocateAllData = async () => {
    if (this.data_rowdetail.length == this.data_shipmentdetail.length || this.data_rowdetail.length == 0) {
        this.record_shipment['username'] = this.appServices.account.username;
        this.appServices.unAllocateAll({'obj': JSON.stringify(this.record_shipment)}, this).then((res) => {
            this.notifyService.success('UnAllocate Done');
            this.updateStatusOrder(this.record_shipment)
            this.findOrderData(this.record_shipment);
        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        })
    } else if (this.data_rowdetail.length > 0) {
        this.appServices.unAllocateItemSelect({ 'obj': JSON.stringify(this.data_rowdetail),'username':this.appServices.account.username}, this).then((res) => {
            this.notifyService.success('UnAllocate Done');
            this.updateStatusOrder(this.record_shipment)
            this.findOrderData(this.record_shipment);
        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        })
    }
    this.data_rowdetail = new Array();
  }


  pickAllData = async () => {
    if (this.data_rowdetail.length == this.data_shipmentdetail.length || this.data_rowdetail.length == 0) {
        this.record_shipment['username'] = this.appServices.account.username;
        this.appServices.pickAll({'obj': JSON.stringify(this.record_shipment)}, this).then((res) => {
            this.notifyService.success('Pick Done');
            this.updateStatusOrder(this.record_shipment)
            this.findOrderData(this.record_shipment);
        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        })
    } else if (this.data_rowdetail.length > 0) {
        this.appServices.pickItemSelect({ 'obj': JSON.stringify(this.data_rowdetail),'username':this.appServices.account.username}, this).then((res) => {
            this.notifyService.success('Pick Done');
            this.updateStatusOrder(this.record_shipment)
            this.findOrderData(this.record_shipment);
        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        })
    }
    this.data_rowdetail = new Array();
  }

  unPickAllData = async () => {
    if (this.data_rowdetail.length == this.data_shipmentdetail.length || this.data_rowdetail.length == 0) {
        this.record_shipment['username'] = this.appServices.account.username;
        this.appServices.unPickAll({'obj': JSON.stringify(this.record_shipment)}, this).then((res) => {
            this.notifyService.success('UnPick Done');
            this.updateStatusOrder(this.record_shipment)
            this.findOrderData(this.record_shipment);
        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        })
    } else if (this.data_rowdetail.length > 0) {
        this.appServices.unPickItemSelect({ 'obj': JSON.stringify(this.data_rowdetail),'username':this.appServices.account.username}, this).then((res) => {
            this.notifyService.success('UnPick Done');
            this.updateStatusOrder(this.record_shipment)
            this.findOrderData(this.record_shipment);
        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        })
    }
    this.data_rowdetail = new Array();
  }

  shipAllData = async () => {
    if (this.data_rowdetail.length == this.data_shipmentdetail.length || this.data_rowdetail.length == 0) {
        this.record_shipment['username'] = this.appServices.account.username;
        this.appServices.unShipAll({'obj': JSON.stringify(this.record_shipment)}, this).then((res) => {
            this.notifyService.success('Ship Done');
            this.updateStatusOrder(this.record_shipment)
            this.findOrderData(this.record_shipment);
        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        })
    } else if (this.data_rowdetail.length > 0) {
        this.appServices.unShipItemSelect({ 'obj': JSON.stringify(this.data_rowdetail),'username':this.appServices.account.username}, this).then((res) => {
            this.notifyService.success('Ship Done');
            this.updateStatusOrder(this.record_shipment)
            this.findOrderData(this.record_shipment);
        }).catch((err) => {
            this.notifyService.error(err.err.json().error.message);
        })
    }
    this.data_rowdetail = new Array();
  }
 

  pickPickDetail() {
    if (this.data_rowpick.length > 0) {
      let promises = [];
      let el = this.data_rowpick[0];
      this.data_rowpick.forEach((valuerow, index, arr) => {
        if (valuerow.statusOrder == 17 || valuerow.statusOrder == 52) {
          // valuerow['status'] = valuerow.statusOrder;
          valuerow['storerkey'] = valuerow.STORERKEY;
          valuerow['orderkey'] = valuerow.ORDERKEY;
          valuerow['orderlinenumber'] = valuerow.ORDERLINENUMBER;
          valuerow['whseid'] = this.appServices.account.whseid;
          valuerow['username'] = this.appServices.account.username;
          promises.push(new Promise((resolve, reject) => {
            this.appServices.pickpickdetail({ 'obj': JSON.stringify(valuerow) }, this).then((obj) => {
              resolve();
            }).catch(function (err) {
              reject(err);
            });
          }));
        }
      });
      Promise.all(promises).then(() => {
        this.loadPickDetail('', el, true)
        this.updateStatusOrder(this.record_shipment);
        this.findOrderData(this.record_shipment);
        this.notifyService.success('Done');
      }).catch(err => {
        this.utilityService.handleError(err);
      })
    } else {
      let promises = [];
      let el = this.data_pick[0];
      this.data_pick.forEach((value, index, arr) => {
        if (value.statusOrder == 17 || value.statusOrder == 52) {
          // value['status'] = value.statusOrder;
          value['storerkey'] = value.STORERKEY;
          value['orderkey'] = value.ORDERKEY;
          value['orderlinenumber'] = value.ORDERLINENUMBER;
          value['whseid'] = this.appServices.account.whseid;
          value['username'] = this.appServices.account.username;
          promises.push(new Promise((resolve, reject) => {
            this.appServices.pickpickdetail({ 'obj': JSON.stringify(value) }, this).then((obj) => {
              resolve();
            }).catch(function (err) {
              reject(err);
            });
          }));
        }
      });
      Promise.all(promises).then(() => {
        this.loadPickDetail('', el, true)
        this.updateStatusOrder(this.record_shipment);
        this.findOrderData(this.record_shipment);
        this.notifyService.success('Done');
      }).catch(err => {
        this.utilityService.handleError(err);
      })
    }
    this.data_rowpick = new Array();
  }

  unPickDetail() {
    if (this.data_rowpick.length > 0) {
      let promises = [];
      let el = this.data_rowpick[0];
      this.data_rowpick.forEach((valuerow, index, arr) => {
        if (valuerow.statusOrder == 52 || valuerow.statusOrder == 55) {
          // valuerow['status'] = valuerow.statusOrder;
          valuerow['storerkey'] = valuerow.STORERKEY;
          valuerow['orderkey'] = valuerow.ORDERKEY;
          valuerow['orderlinenumber'] = valuerow.ORDERLINENUMBER;
          valuerow['whseid'] = this.appServices.account.whseid;
          valuerow['username'] = this.appServices.account.username;
          promises.push(new Promise((resolve, reject) => {
            this.appServices.unPick({ 'obj': JSON.stringify(valuerow) }, this).then((obj) => {
              resolve();
            }).catch(function (err) {
              reject(err);
            });
          }));
        }
      });
      Promise.all(promises).then(() => {
        this.notifyService.success('Done');
        this.loadPickDetail('', el, true)
        this.updateStatusOrder(this.record_shipment);
        this.findOrderData(this.record_shipment);
      }).catch(err => {
        this.utilityService.handleError(err);
      })
    } else {
      let promises = [];
      let el = this.data_pick[0];
      this.data_pick.forEach((value, index, arr) => {
        if (value.statusOrder == 52 || value.statusOrder == 55) {
          // value['status'] = value.statusOrder;
          value['storerkey'] = value.STORERKEY;
          value['orderkey'] = value.ORDERKEY;
          value['orderlinenumber'] = value.ORDERLINENUMBER;
          value['whseid'] = this.appServices.account.whseid;
          value['username'] = this.appServices.account.username;
          promises.push(new Promise((resolve, reject) => {
            this.appServices.unPick({ 'obj': JSON.stringify(value) }, this).then((obj) => {
              resolve();
            }).catch(function (err) {
              reject(err);
            });
          }));
        }
      });
      Promise.all(promises).then(() => {
        this.notifyService.success('Done');
        this.loadPickDetail('', el, true)
        this.updateStatusOrder(this.record_shipment);
        this.findOrderData(this.record_shipment);
      }).catch(err => {
        this.utilityService.handleError(err);
      })
    }
    this.data_rowpick = new Array();
  }

  shipPickDetail() {

    if (this.data_rowpick.length > 0) {
      let promises = [];
      let el = this.data_rowpick[0];
      this.data_rowpick.forEach((valuerow, index, arr) => {
        if (valuerow.statusOrder == 55 || valuerow.statusOrder == 92) {
          // valuerow['status'] = valuerow.statusOrder;
          valuerow['storerkey'] = valuerow.STORERKEY;
          valuerow['orderkey'] = valuerow.ORDERKEY;
          valuerow['orderlinenumber'] = valuerow.ORDERLINENUMBER;
          valuerow['whseid'] = this.appServices.account.whseid;
          valuerow['username'] = this.appServices.account.username;
          promises.push(new Promise((resolve, reject) => {
            this.appServices.shippickdetail({ 'obj': JSON.stringify(valuerow) }, this).then((obj) => {
              resolve();
            }).catch(function (err) {
              reject(err);
            });
          }));
        }
      });
      Promise.all(promises).then(() => {
        this.notifyService.success('Ship Done');
        this.loadPickDetail('', el, true)
        this.updateStatusOrder(this.record_shipment);
        this.findOrderData(this.record_shipment);
      }).catch(err => {
        this.utilityService.handleError(err);
      })
    }

    else {

      let promises = [];
      let el = this.data_pick[0];
      this.data_pick.forEach((value, index, arr) => {
        if (value.statusOrder == 55 || value.statusOrder == 92) {
          // valuerow['status'] = valuerow.statusOrder;
          value['storerkey'] = value.STORERKEY;
          value['orderkey'] = value.ORDERKEY;
          value['orderlinenumber'] = value.ORDERLINENUMBER;
          value['whseid'] = this.appServices.account.whseid;
          value['username'] = this.appServices.account.username;
          promises.push(new Promise((resolve, reject) => {
            this.appServices.shippickdetail({ 'obj': JSON.stringify(value) }, this).then((obj) => {
              resolve();
            }).catch(function (err) {
              reject(err);
            });
          }));
        }
      });
      Promise.all(promises).then(() => {
        this.notifyService.success('Ship Done');
        this.loadPickDetail('', el, true)
        this.updateStatusOrder(this.record_shipment);
        this.findOrderData(this.record_shipment);
      }).catch(err => {
        this.utilityService.handleError(err);
      })
    }
  }

  changeOwner(data) {
    this.loadLottable_Data1(data);
    this.categorySKU(data.storerkey);
    let arraydata = {
      storerkey: data.storerkey,
      orderlinenumber: ''
    }
    this.initShipmentDetail(arraydata);
    this.data_shipmentdetail = [];
  }

  addNewRow(data) {
    $('#tblDetail').scrollTop(0);
    if (!this.new_shipmentdetail.sku) {
      this.notifyService.warning("Expected Sku can not empty");
    } else if (!this.new_shipmentdetail.uom) {
      this.notifyService.warning("Expected Uom can not empty");
    } else if (!this.new_shipmentdetail.openqty) {
      this.notifyService.warning("Expected Quantity can not empty");
    } else if (this.new_shipmentdetail.openqty < 0) {
      this.notifyService.warning("Expected Quantity can not negative real number");
    } else {
      this.data_shipmentdetail.unshift(this.new_shipmentdetail);
      this.loadAllUOM();
      let number = parseInt((data.orderlinenumber).length) - ((parseInt(data.orderlinenumber) + (1)).toString()).length;
      let neworderlinenumber = ((data.orderlinenumber).substring(0, number) + (parseInt(data.orderlinenumber) + (1)).toString());
      let arraydata = {
        storerkey: data.storerkey,
        orderlinenumber: data.orderlinenumber != "" ? neworderlinenumber : '00001'
      }
      this.initShipmentDetail(arraydata);
    }
  }

  initShipment() {
    this.record_shipment = {
      'orderkey': 'New',
      'statustext': 'New',
      'type': '',
      'storerkey': '',
      'consigneekey': '',
      'shipcode': '',
      'carriercode': '',
      'externorderkey': '',
      'invoiceno': '',
      'susr1': '',
      'notes2': '',
      'orderdate': '',
      'requestedshipdate': '',
      'door': '',
      'id_cur': '',
      'shiptime': '',
      'total_qty': '',
      'total_allocated': '',
      'total_picked': '',
      'total_shipped': ''
    };
  }
  initShipmentDetail(data) {
    let orderlinenumber = data.orderlinenumber ? data.orderlinenumber : "00001";
    this.new_shipmentdetail = {
      'orderlinenumber': orderlinenumber,
      'sku': '',
      'lottable01': '',
      'lottable02': '',
      'uom': '',
      'openqty': '',
      'qtyallocated': 0,
      'qtypicked': 0,
      'shippedqty': 0,
      'susr4': '',
      'unitprice': 0,
      'discount': 0,
      'vat': 0,
      'storerkey': data.storerkey
    };
  }

  deleteOrder() {
    let promises = [];
    let data = Object.assign({}, this.selected_order);
    if (data.status != "04") {
      this.notifyService.warning("Can not be delete");

    } else if (data.status == "04") {
      data['deleted'] = true;
      data['editwho'] = this.appServices.account.username;

      promises.push(new Promise((resolve, reject) => {
        this.appServices.deleteOrders({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
          resolve();
        }).catch(function (err) {
          reject(err);
        });
      }));
      Promise.all(promises).then(() => {
        this.notifyService.success('Done');
        $('#modaldeleteOrder').modal('hide');
        this.loadShipmentData();
      }).catch(err => {
        this.utilityService.handleError(err);
      })
    }
  }

  deleteDetail(data) {
    data['deleted'] = true;
    data['editwho'] = this.appServices.account.username;
    this.appServices.deleteOrdersDetail({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
      let res = obj.response.json().res;
    }).catch((err) => {
      this.utilityService.handleError(err);
    });

  }

  deleteRowDetail() {
    let promises = [];
    let counterror = 0;
    this.data_rowdetail.forEach((value, index, arr) => {
      if (value.status == "14" || value.status == "17") {
        this.notifyService.error("Linenumber " + value.receiptlinenumber + " Allocated could not be delete");
        counterror++;
      } else
        if (value.status == "52" || value.status == "55") {
          this.notifyService.error("Linenumber " + value.receiptlinenumber + " Parted could not be delete");
          counterror++;
        } else
          if (value.status == "92" || value.status == "95") {
            this.notifyService.error("Linenumber " + value.receiptlinenumber + " Shipped could not be delete");
            counterror++;
          } else
            if (counterror == 0 && value.status == "04") {
              value['deleted'] = true;
              value['editwho'] = this.appServices.account.username;

              promises.push(new Promise((resolve, reject) => {
                this.appServices.updateOrdersDetail({ 'obj': JSON.stringify(value) }, this).then(function (obj) {
                  resolve();
                }).catch(function (err) {
                  reject(err);
                });
              }));
            }
    });
    Promise.all(promises).then(() => {
      this.notifyService.success('Done');
      this.findOrderData(this.record_shipment);
    }).catch(err => {
      this.utilityService.handleError(err);
    })
  }

  categorySKU(data) {
    if (data != undefined) {
      this.appServices.categorySKU({ 'whseid': this.appServices.account.whseid, 'storerkey': data }, this).then(function (obj) {
        let res = obj.response.json().res;
        obj.component.data_SKU = obj.component.completerService.local(res, 'SKU', 'SKU');
      }).catch((err) => {
        this.utilityService.handleError(err);
      })
    }
  }

  onChooseOrder(e, data) {
    if (e.target.checked) {
      this.delete_shipment.push(data);
    }
    else {
      let index = this.delete_shipment.indexOf(data);
      this.delete_shipment.splice(index, 1);
    }
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

  checkAll_Shipment(e) {
    if (e.srcElement.checked) {
      this.data_shipmentdetail.forEach(curr_data => {
        curr_data.state = e.target.checked;
        this.data_rowdetail.push(curr_data);
      })
    } else {
      this.data_shipmentdetail.forEach(x => x.state = e.target.checked);
      this.data_rowdetail = [];
    }
  }
  isAllChecked_Shipment() {
    return this.data_shipmentdetail.every(_ => _.state);
  }


  onChoosePick(e, data) {
    if (e.target.checked) {
      this.data_rowpick.push(data);
    }
    else {
      let index = this.data_rowpick.indexOf(data);
      this.data_rowpick.splice(index, 1);
    }
  }


  new() {
    this.initShipment();
    this.data_shipmentdetail = [];
    this.new_shipmentdetail = [];
    // this.el.nativeElement.click();
    $(this.tabDetail.nativeElement).tab('show');
  }

  showModalAddMasterPick() {
    if (this.delete_shipment.length > 0) {
      let storerkey = this.delete_shipment[0].storerkey;
      if (this.delete_shipment.filter((value) => {
        return value.storerkey !== storerkey || value.susr5 || value.status === '95';
      }).length > 0) {
        this.notifyService.error('Invalid! <br /> - Please select same Owner for multiple select <br /> - SO not yet Master Pick <br /> - SO not yet Shipped ');
      } else {
        $('#modalAddMasterPick').modal('show');
      }
    } else {
      this.notifyService.error('Please select SO!');
    }
  }
  addMasterPick(data) {
    if (this.isMasterPick) {
      data['whseid'] = this.appServices.account.whseid;
      data['storerkey'] = this.delete_shipment[0].storerkey;
      data['status'] = "0";
      data['addwho'] = this.appServices.account.username;
      this.appServices.insertMasterPick(data, this).then(function (obj) {
        this.notifyService.success('Process Done!');
        obj.component.loadMasterPickData();
        obj.component.isMasterPick = false;
      }).catch((err) => {
        this.utilityService.handleError(err);
      })
    } else {
      this.delete_shipment.forEach((value, index, arr) => {
        value['susr5'] = data['mastercode'];
        this.updateOrderData(value);
      })
      $('#modalAddMasterPick').modal('hide');
    }
  }
  showModalRemoveMasterPick() {
    if (this.delete_shipment.length > 0) {
      let storerkey = this.delete_shipment[0].storerkey;
      if (this.delete_shipment.filter((value) => {
        return value.storerkey !== storerkey || value.status === '95' || !value.susr5;
      }).length > 0) {
        this.notifyService.error('Invalid! <br /> - Please select same Owner for multiple select <br /> - SO not yet Shipped <br /> - SO has been Master Pick  ');
      } else {
        let err = 0;
        this.delete_shipment.forEach((value, index, arr) => {
          this.appServices.findMasterPick({ 'filter': JSON.stringify({ 'where': { 'mastercode': value.susr5, 'whseid': value.whseid } }) }, this).then((obj) => {
            let res = obj.response.json().res;
            if (res[0].lock === 1) {
              err++;
            }
            if (index === arr.length - 1) {
              if (err > 0) {
                this.notifyService.error('Invalid! <br /> - Please select SO unlock ! ');
              } else {
                $('#modalRemoveMasterPick').modal('show');
              }
            }
          }).catch(function (err) {
            this.notifyService.error('Invalid! <br /> - Please select SO other ! ');
          })
        })
      }
    } else {
      this.notifyService.error('Please select SO!');
    }
  }
  removeMasterPickData() {
    this.delete_shipment.forEach((value, index, arr) => {
      value['susr5'] = '';
      this.updateOrderData(value);
    })
    $('#modalRemoveMasterPick').modal('hide');
  }
  showModalLockMasterPick() {
    if (this.delete_shipment.length > 0) {
      let storerkey = this.delete_shipment[0].storerkey;
      if (this.delete_shipment.filter((value) => {
        return value.storerkey !== storerkey || value.status === '95' || !value.susr5;
      }).length > 0) {
        this.notifyService.error('Invalid! <br /> - Please select same Owner for multiple select <br /> - SO not yet Shipped <br /> - SO has been Master Pick  ');
      } else {
        $('#modalLockMasterPick').modal('show');
      }
    } else {
      this.notifyService.error('Please select SO!');
    }
  }
  lockMasterPickData() {
    this.delete_shipment.forEach((value, index, arr) => {
      this.appServices.findMasterPick({ 'filter': JSON.stringify({ 'where': { 'mastercode': value.susr5, 'whseid': value.whseid } }) }, this).then(function (obj) {
        let _data = obj.response.json().res[0];
        _data['lock'] = _data['lock'] === 1 ? 0 : 1;
        obj.component.appServices.updateMasterPick(_data, this).then((_obj) => {
          if (index === arr.length - 1) {
            this.notifyService.success('Process Done!');
            $('#modalLockMasterPick').modal('hide');
          }
        }).catch((err) => {
          this.utilityService.handleError(err);
        })
      }).catch((err) => {
        this.notifyService.error('Invalid! <br /> - Please select SO other ! ');
      })
    })
  }
  explodeRowDetail() {
    this.data_rowdetail.forEach((value, index, arr) => {
      if (value['status'] === '04' || value['status'] === undefined) {
        this.appServices.queryBom({ 'whseid': this.appServices.account.whseid, 'deleted': false, 'storerkey': value.storerkey, 'sku': value.sku }, this).then(function (obj) {
          let res = obj.response.json().res;
          if (res.length > 0) {
            for (let i = 0; i < obj.component.data_shipmentdetail.length; i++) {
              if (obj.component.data_shipmentdetail[i].orderlinenumber === value.orderlinenumber) {
                obj.component.data_shipmentdetail.splice(i, 1);
                break;
              }
            }
            res.forEach((value_bom, index_bom, arr_bom) => {
              obj.component.data_shipmentdetail.push({
                'orderlinenumber': value.orderlinenumber,
                'sku': value_bom.componentsku,
                'lottable01': '',
                'uom': value_bom.Case,
                'openqty': value.openqty * value_bom.qty,
                'qtyallocated': 0,
                'qtypicked': 0,
                'shippedqty': 0,
                'susr4': '',
                'unitprice': 0,
                'discount': 0,
                'vat': 0,
                'storerkey': value.storerkey
              });
            })
            obj.component.data_shipmentdetail.forEach((_value, _index, _arr) => {
              _value.orderlinenumber = _value.orderlinenumber.replace(parseInt(_value.orderlinenumber).toString(), (_index + 1).toString());
            })
          }
        }).catch((err) => {
          this.utilityService.handleError(err);
        })
      }
    })
    this.data_rowdetail = [];
  }
  printPackingList() {
    this.reportService.packingList({
      whseid: this.appServices.account.whseid,
      username: this.appServices.account.username,
      orderkey: this.record_shipment.orderkey,
      storerkey: this.record_shipment.storerkey
    });
  }

  printPickingList() {
    this.reportService.pickingList({
      whseid: this.appServices.account.whseid,
      username: this.appServices.account.username,
      orderkey: this.record_shipment.orderkey,
      storerkey: this.record_shipment.storerkey
    });
  }

  printShipmentOrder() {
    this.reportService.shipmentOrder({
      whseid: this.appServices.account.whseid,
      username: this.appServices.account.username,
      orderkey: this.record_shipment.orderkey,
      storerkey: this.record_shipment.storerkey
    });
  }
  doExportOrder(data, filename) {
    if (data.length > 0) {
      data.forEach((value, index, arr) => {
        value['orderkey'] = value['orderkey'];
      })
      new Angular2Csv(data, filename + '_' + (new Date()).getFullYear() + '-' + (parseInt((new Date()).getMonth().toString()) + 1) + '-' + (new Date()).getDate() + (new Date()).getSeconds(), {
        headers: Object.keys(data[0]),
        showTitle: true,
        fieldSeparator: ','
      })
    } else {
      this.notifyService.warning('No record existed!');
    }
  }

  InitOrderToExport(data, type = 0) {
    let list = [];
    let obj = {};
    data.forEach((value, index, arr) => {
      obj = {};
      obj['orderkey'] = value['orderkey'] !== undefined ? value['orderkey'] : '';
      obj['storerkey'] = value['storerkey'] !== undefined ? value['storerkey'] : '';
      obj['externorderkey'] = value['externorderkey'] !== undefined ? value['externorderkey'] : '';
      obj['susr1'] = value['susr1'] !== undefined ? value['susr1'] : '';
      obj['susr5'] = value['susr5'] !== undefined ? value['susr5'] : '';
      obj['status'] = value['status'] !== undefined ? value['status'] : 0;
      if (type == 0) {
        obj['whseid'] = value['whseid'] !== undefined ? value['whseid'] : '';
        obj['adddate'] = value['adddate'] !== undefined ? value['adddate'] : '';
        obj['addwho'] = value['addwho'] !== undefined ? value['addwho'] : '';
        obj['editdate'] = value['editdate'] !== undefined ? value['editdate'] : '';
        obj['editwho'] = value['editwho'] !== undefined ? value['editwho'] : '';
      }
      if (value['error']) obj['error'] = value['error'];
      list.push(obj);
    })
    return list;
  }


  loadModalUOM(data) {
    $(`#${this.id.uom}`).modal('show');
    this.loadUOM1(data)
  }
  loadModalUOMRemove(i, id, data) {
    $(`#${this.id.uom}`).modal('show');
    $('#uomedit').val(id);
    $('#indexedit').val(i);
    this.loadUOM1(data);
  }

  getUOM(data) {
    var uomedit = $('#uomedit').val();
    var i = +$('#indexedit').val();
    if (!uomedit) {//new
      $(`#${this.id.uom}`).modal('hide');
      $('#uom').val(data.description);
      this.new_shipmentdetail.uom = data.code;
    } else {//edit
      $(`#${this.id.uom}`).modal('hide');
      $('#' + uomedit + '').val(data.description);
      this.data_shipmentdetail[i].uom = data.code
    }
    $('#uomedit').val('')
  }

  @ViewChild('modalSKU') childsku: PopupSKUComponent;
  private shipmentDetail: any;
  openModalSKU(shipmentDetail = null) {
    this.shipmentDetail = shipmentDetail;
    if (this.record_shipment.storerkey) this.childsku.open({
      storerkey: this.record_shipment.storerkey
    });
    else {
      this.notifyService.warning('Please select Owner');
    }
  }
  selectsku(data) {
    if (!this.shipmentDetail) {//new
      this.new_shipmentdetail.sku = data.sku;
    } else {//edit
      this.shipmentDetail.sku = data.sku;
    }
  }

  loadAllocatemanual() {
    let data = {};
    data = this.data_shipmentdetail[0];
    let dynamicTabItem: DynamicTabItem = {
      title: 'Allocatemanual',
      component: AllocatemanualComponent,
      data: Object.assign({}, data)
    }
    this.tabEmitter.emit(dynamicTabItem);
  }

  @ViewChild('modalCheckin') childcheckin: PopupCheckinComponent;
  private shipment: any;
  openModalCheckin(shipment = null) {
    this.shipment = shipment;
    this.childcheckin.open({
      storerkey: this.record_shipment.storerkey
    });
  }
  selectcheckin(data) {
    if (!this.record_shipment) {//new
      this.record_shipment.susr1 = data.truckno;
    } else {//edit
      this.record_shipment.susr1 = data.truckno;
    }
  }

  @ViewChild('modalShipcode') childshipcode: PopupShipcodeComponent;
  private shipmentOrder: any;
  openModalShipcode(shipmentOrder = null) {
    if(!this.record_shipment.consigneekey){
      this.notifyService.warning('Please select Customer');
    }else{
      this.shipmentOrder = shipmentOrder;
      this.childshipcode.open({
        storerkey: this.record_shipment.consigneekey
      });
    }
  }
  selectshipcode(data) {
    if (!this.record_shipment) {//new
      this.record_shipment.shipcode = data.shipcode;
    } else {//edit
      this.record_shipment.shipcode = data.shipcode;
    }
  }

}
