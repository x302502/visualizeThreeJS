import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { PasteService } from './../../paste.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { DatePipe } from '@angular/common';
import { CompleterService, CompleterData } from 'ng2-completer';
import * as $ from 'jquery';
import 'bootstrap';
import { UtilityService } from '../../services/utility-service/utility.service';
import { DynamicTabItem, DynamicComponent } from '../../common/dynamic-loader/dynamic-loader.model';
@Component({
  selector: 'app-post-stock-list',
  templateUrl: './post-stock-list.component.html',
  styleUrls: ['./post-stock-list.component.css']
})
export class PostStockListComponent implements DynamicComponent {
  //#region Dynamic Component
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  //#endregion
  data_stockcount = []; selected_stockcount; currentPage_stockcount = 1; itemsPerPage_stockcount = 5; total_stockcount = 0;
  data_stockcountdetail = []; selected_stockcountdetail; delete_stockcountdetail = []; currentPage_stockcountdetail = 1; itemsPerPage_stockcountdetail = 5; total_stockcountdetail = 0;
  times = 1;
  data_temp;
  strSearchOwner; data_owner;
  strSearchSku; data_sku;

  fl_stockcountcode = ''; fl_remark = ''; fl_addwho = ''; fl_editwho = ''; fl_status = '';
  propertyName_list; order_list = 'ASC';

  fd_storerkey = ''; fd_sku = ''; fd_qtycase = ''; fd_qtypiece = ''; fd_lottable01 = ''; fd_lottable04 = ''; fd_lottable05 = ''; fd_location = '';
  propertyName_detail; order_detail = 'ASC';

  constructor(private router: Router,
    private appServices: AppServices,
    private notifyService: NotifyService,
    private pasteService: PasteService,
    private datepipe: DatePipe,
    private completerService: CompleterService,
    private utilityService: UtilityService) {
  }
  ngOnInit() {
    $('body').off('paste');
    this.loadStockCountData();
    this.data_owner = this.completerService.local(this.appServices.account.owners, 'storerkey', 'storerkey');
    this.loadSkuData();
  }
  loadStockCountData(param?: Object) {
    let skip = (this.currentPage_stockcount - 1) * this.itemsPerPage_stockcount;
    let limit = this.itemsPerPage_stockcount;
    this.data_temp = null;
    let filter;
    if (param) {
      if (this.fl_stockcountcode.length > 0) filter = $.extend(filter, { 'stockcountcode': { like: this.fl_stockcountcode } });
      if (this.fl_remark.length > 0) filter = $.extend(filter, { 'remark': { like: this.fl_remark } });
      if (this.fl_addwho.length > 0) filter = $.extend(filter, { 'addwho': { like: this.fl_addwho } });
      if (this.fl_editwho.length > 0) filter = $.extend(filter, { 'editwho': { like: this.fl_editwho } });
      if (this.fl_status.length > 0) filter = $.extend(filter, { 'status': this.fl_status });
    }
    this.appServices.findStock({ 'filter': JSON.stringify({ 'where': $.extend({ 'whseid': this.appServices.account.whseid }, filter), 'skip': skip, 'limit': limit, 'order': this.propertyName_list ? this.propertyName_list + " " + this.order_list : null }) }, this)
      .then(function (__) {
        let json = __.response.json();
        __.component.data_stockcount = json.res;
        __.component.total_stockcount = json.total;
      }).catch((err) => {
        this.utilityService.handleError(err);
      })
  }
  loadStockCountDetailData(param?: Object) {
    let skip = (this.currentPage_stockcountdetail - 1) * this.itemsPerPage_stockcountdetail;
    let limit = this.itemsPerPage_stockcountdetail;
    this.data_temp = null;
    this.delete_stockcountdetail = [];

    let filter;
    let pd_qtycase, pd_qtypiece;
    if (param) {
      if (this.fd_storerkey.length > 0) filter = $.extend(filter, { 'storerkey': { like: this.fd_storerkey } });
      if (this.fd_sku.length > 0) filter = $.extend(filter, { 'sku': { like: this.fd_sku } });
      if (this.fd_lottable01.length > 0) filter = $.extend(filter, { 'lottable01': { like: this.fd_lottable01 } });
      if (this.fd_location.length > 0) filter = $.extend(filter, { 'location': { like: this.fd_location } });

      if (this.fd_qtycase.length > 0) {
        pd_qtycase = parseInt(this.fd_qtycase.trim().replace('>=', '').replace('<=', '').replace('>', '').replace('<', ''));
        filter = this.fd_qtycase.indexOf('>=') > -1 ? $.extend(filter, { 'qtycase': { gte: pd_qtycase } }) : (this.fd_qtycase.indexOf('<=') > -1 ? $.extend(filter, { 'qtycase': { lte: pd_qtycase } }) :
          (this.fd_qtycase.indexOf('>') > -1 ? $.extend(filter, { 'qtycase': { gt: pd_qtycase } }) : (this.fd_qtycase.indexOf('<') > -1 ? $.extend(filter, { 'qtycase': { lt: pd_qtycase } }) : $.extend(filter, { 'qtycase': pd_qtycase }))));
      }
      if (this.fd_qtypiece.length > 0) {
        pd_qtypiece = parseInt(this.fd_qtypiece.trim().replace('>=', '').replace('<=', '').replace('>', '').replace('<', ''));
        filter = this.fd_qtypiece.indexOf('>=') > -1 ? $.extend(filter, { 'qtypiece': { gte: pd_qtypiece } }) : (this.fd_qtypiece.indexOf('<=') > -1 ? $.extend(filter, { 'qtypiece': { lte: pd_qtypiece } }) :
          (this.fd_qtypiece.indexOf('>') > -1 ? $.extend(filter, { 'qtypiece': { gt: pd_qtypiece } }) : (this.fd_qtypiece.indexOf('<') > -1 ? $.extend(filter, { 'qtypiece': { lt: pd_qtypiece } }) : $.extend(filter, { 'qtypiece': pd_qtypiece }))));
      }
    }

    if (this.selected_stockcount) {
      this.appServices.findStockDetail({ 'filter': JSON.stringify({ 'where': $.extend({ 'whseid': this.appServices.account.whseid, 'stockcountcode': this.selected_stockcount.stockcountcode }, filter), 'skip': skip, 'limit': limit, 'order': this.propertyName_detail ? this.propertyName_detail + " " + this.order_detail : null }) }, this)
        .then(function (__) {
          let json = __.response.json();
          __.component.data_stockcountdetail = json.res;
          __.component.total_stockcountdetail = json.total;
        }).catch((err) => {
          this.utilityService.handleError(err);
        })
    }
  }
  loadSkuData() {
    this.appServices.listSku({ 'whseid': this.appServices.account.whseid, 'deleted': false }, this).then(function (__) {
      __.component.data_sku = __.component.completerService.local(__.response.json().res, 'sku', 'sku');
    }).catch((err) => {
      this.utilityService.handleError(err);
    })
  }

  updateStockCountDetailData(data) {
    data['editwho'] = this.appServices.account.username;
    data['currentuser'] = this.appServices.account.username;
    if (data['qtycase'] == data['qtycase' + this.times] && data['qtypiece'] == data['qtypiece' + this.times]) {
      data['status' + this.times] = true;
    } else {
      data['status' + this.times] = false;
    }
    this.appServices.updateStockDetail({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
      let res = obj.response.json();
      obj.component.notifyService.show('Process Done');
    }).catch(err => {
      this.utilityService.handleError(err);
    })
  }

  findStockCountData(data) {
    this.data_stockcountdetail = [];
    this.total_stockcountdetail = 0;
    this.selected_stockcount = data;
    $('a[href="#tabdetail"]').trigger('click');
    this.times = 1;
    $('input[name="times1"]').parent().removeClass('active');
    $('input[name="times2"]').parent().removeClass('active');
    $('input[name="times3"]').parent().removeClass('active');
  }

  closeStockCount(data) {
    this.appServices.checkToken({ 'token': this.appServices.account.token }, this).then(function (success) {
      data['status'] = 2;
      data['editwho'] = success.component.appServices.account.username;
      data['currentuser'] = this.appServices.account.username;
      success.component.appServices.updateStock({ 'obj': JSON.stringify(data) }, success.component).then(function (obj) {
        success.component.notifyService.show('Process Done!');
      }).catch(err => {
        this.utilityService.handleError(err);
      })
    }).catch((err) => {
      this.utilityService.handleError(err);
    })
  }

  PostStockData() {
    this.appServices.checkToken({ 'token': this.appServices.account.token }, this).then(function (success) {
      success.component.appServices.listStockDetail({ 'obj': JSON.stringify({ 'whseid': success.component.appServices.account.whseid, 'stockcountcode': success.component.selected_stockcount.stockcountcode }) }, this).then(function (res) {
        let data = res.response.json().res;
        let _times = 0;
        if (data[0].keydate3) {
          _times = 3;
        } else if (data[0].keydate2) {
          _times = 2;
        } else if (data[0].keydate1) {
          _times = 1;
        } else {
          success.component.notifyService.show('This PCS have not checked', 'danger');
        }
        if (_times > 0) {
          data.forEach((value, index, arr) => {
            if (value['status' + _times] == false) {
              success.component.appServices.getInventoryStockDetail({ 'obj': JSON.stringify(value) }, this).then(function (obj) {
                let res = obj.response.json().res;
                if (res.length > 0) {
                  success.component.changeStock(value, res, _times);
                } else {
                  success.component.newReceiptData(value, _times);
                }
              }).catch((err) => {
                this.utilityService.handleError(err);
              })
            }
          });
          success.component.notifyService.show('Process Done!');
        }
      }).catch(err => {
        this.utilityService.handleError(err);
      })
    }).catch((err) => {
      this.utilityService.handleError(err);
    })
  }

  changeStock(poststock, data = [], times) {
    let sku = this.data_sku._data.filter(function (f) {
      return f.sku === data[0].sku;
    })[0];
    this.appServices.findPack({ 'filter': JSON.stringify({ 'where': { 'whseid': this.appServices.account.whseid, 'packkey': sku.packkey } }) }, this)
      .then(function (obj) {
        let pack = obj.response.json().res[0];
        let qty_stock = 0;
        let qty_times = 0;
        let diff = 0;
        if ('PC' == pack.packuom2) {
          if ('CS' == pack.packuom3) {
            qty_times = poststock['qtypiece' + times] * pack.innerpack + poststock['qtycase' + times] * pack.qty;
            qty_stock = poststock['qtypiece'] * pack.innerpack + poststock['qtycase'] * pack.qty;
          } else if ('CS' == pack.packuom4) {
            qty_times = poststock['qtypiece' + times] * pack.innerpack + poststock['qtycase' + times] * pack.pallet;
            qty_stock = poststock['qtypiece'] * pack.innerpack + poststock['qtycase'] * pack.pallet;
          }
        } else if ('PC' == pack.packuom3) {
          if ('CS' == pack.packuom2) {
            qty_times = poststock['qtypiece' + times] * pack.qty + poststock['qtycase' + times] * pack.innerpack;
            qty_stock = poststock['qtypiece'] * pack.qty + poststock['qtycase'] * pack.innerpack;
          } else if ('CS' == pack.packuom4) {
            qty_times = poststock['qtypiece' + times] * pack.qty + poststock['qtycase' + times] * pack.pallet;
            qty_stock = poststock['qtypiece'] * pack.qty + poststock['qtycase'] * pack.pallet;
          }
        } else if ('PC' == pack.packuom4) {
          if ('CS' == pack.packuom2) {
            qty_times = poststock['qtypiece' + times] * pack.pallet + poststock['qtycase' + times] * pack.innerpack;
            qty_stock = poststock['qtypiece'] * pack.pallet + poststock['qtycase'] * pack.innerpack;
          } else if ('CS' == pack.packuom3) {
            qty_times = poststock['qtypiece' + times] * pack.pallet + poststock['qtycase' + times] * pack.qty;
            qty_stock = poststock['qtypiece'] * pack.pallet + poststock['qtycase'] * pack.qty;
          }
        }
        diff = qty_times - qty_stock;
        data.forEach((value, index, arr) => {
          let adjust_qty = value.qty + diff;
          if (adjust_qty < 0) {
            diff = adjust_qty;
            value['adjust_qty'] = value.qty * (-1);
          } else {
            value['adjust_qty'] = diff;
          }
          value['whseid'] = obj.component.appServices.account.whseid;
          value['username'] = obj.component.appServices.account.username;
          value['code'] = 'GENERAL';
          value['currentuser'] = this.appServices.account.username;
          obj.component.appServices.transactionQty({ 'obj': JSON.stringify(value) }, this)
            .then(function (res) {
              let response = res.response.json().res;
            }).catch(err => {
              this.utilityService.handleError(err);
            });
        });
      }).catch(err => {
        this.utilityService.handleError(err);
      });
  }

  newReceiptData(data, times) {
    data['whseid'] = this.appServices.account.whseid;
    data['status'] = "0";
    data['deleted'] = false;
    data['addwho'] = this.appServices.account.username;
    data['type'] = '05';
    data['currentuser'] = this.appServices.account.username;
    this.appServices.insertReceipt({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
      let res = obj.response.json().res;
      obj.component.newReceipDetailtData(res, data, times);
    }).catch(err => {
      this.utilityService.handleError(err);
    });
  }

  newReceipDetailtData(receipt, data, times) {
    let prefix = new Date().toISOString().substring(2, 4);
    let sku = this.data_sku._data.filter(function (f) {
      return f.sku === data.sku;
    })[0];
    this.appServices.findPack({ 'filter': JSON.stringify({ 'where': { 'whseid': this.appServices.account.whseid, 'packkey': sku.packkey } }) }, this)
      .then(function (obj) {
        let pack = obj.response.json().res[0];
        let qtyexpected = 0;
        if ('PC' == pack.packuom2) {
          if ('CS' == pack.packuom3) {
            qtyexpected = data['qtypiece' + times] * pack.innerpack + data['qtycase' + times] * pack.qty;
          } else if ('CS' == pack.packuom4) {
            qtyexpected = data['qtypiece' + times] * pack.innerpack + data['qtycase' + times] * pack.pallet;
          }
        } else if ('PC' == pack.packuom3) {
          if ('CS' == pack.packuom2) {
            qtyexpected = data['qtypiece' + times] * pack.qty + data['qtycase' + times] * pack.innerpack;
          } else if ('CS' == pack.packuom4) {
            qtyexpected = data['qtypiece' + times] * pack.qty + data['qtycase' + times] * pack.pallet;
          }
        } else if ('PC' == pack.packuom4) {
          if ('CS' == pack.packuom2) {
            qtyexpected = data['qtypiece' + times] * pack.pallet + data['qtycase' + times] * pack.innerpack;
          } else if ('CS' == pack.packuom3) {
            qtyexpected = data['qtypiece' + times] * pack.pallet + data['qtycase' + times] * pack.qty;
          }
        }
        let cube = qtyexpected * (sku.stdcube);
        let grosswgt = qtyexpected * (sku.stdgrosswgt);
        let netwgt = qtyexpected * (sku.stdnetwgt);
        data['whseid'] = obj.component.appServices.account.whseid;
        data['conditioncode'] = 'R';
        data['uom'] = 'PC';
        data['receiptkey'] = receipt.receiptkey;
        data['receiptlinenumber'] = '00001';
        data['qtyexpected'] = qtyexpected;
        data['toloc'] = "STAGE";
        data['lpnid'] = (receipt.receiptkey) + (data.receiptlinenumber);
        data['externreceiptkey'] = '';
        data['cube'] = cube;
        data['grosswgt'] = grosswgt;
        data['netwgt'] = netwgt;
        data['packkey'] = pack.packkey;
        data['casecnt'] = pack.casecnt;
        data['innerpack'] = pack.innerpack;
        data['pallet'] = pack.pallet;
        data['type'] = receipt.type;
        data['deleted'] = false;
        data['addwho'] = obj.component.appServices.account.username;
        data['lottable01'] = data['lottable01' + times] ? data['lottable01' + times] : '';
        data['lottable04'] = data['lottable04' + times];
        data['lottable05'] = data['lottable05' + times];
        data['currentuser'] = this.appServices.account.username;
        obj.component.appServices.insertReceiptDetail({ 'obj': JSON.stringify(data) }, this)
          .then(function (object) {
            let response = object.response.json().res;
          }).catch(err => {
            this.utilityService.handleError(err);
          });
      }).catch(err => {
        this.utilityService.handleError(err);
      });
  }

  addNewRow() {
    $('#tbldetail').scrollTop(0);
    this.data_temp = {
      'whseid': this.appServices.account.whseid,
      'stockcountcode': this.selected_stockcount.stockcountcode,
      'storerkey': '',
      'sku': '',
      'qtycase': 0,
      'qtypiece': 0,
      'lottable01': '',
      'lottable04': '',
      'lottable05': '',
      'location': '',
      'qtycase2': 0,
      'qtypiece2': 0,
      'qtycase3': 0,
      'qtypiece3': 0
    }
  }

  submitNewRow() {
    let data = this.data_temp;
    if (!data.storerkey || !data.sku || !data.location) {
      this.notifyService.show('Input not correct!', 'danger');
    } else {
      if (this.data_owner._data.findIndex(function (f) {
        if (f.storerkey === data.storerkey) return f;
      }) < 0) {
        this.notifyService.show('Owner not correct!', 'danger');
      } else if (this.data_sku._data.findIndex(function (z) {
        if (z.sku === data.sku) return z;
      }) < 0) {
        this.notifyService.show('Item not correct!', 'danger');
      } else if (!this.data_temp.location) {
        this.notifyService.show('Location not correct!', 'danger');
      } else {
        data['addwho'] = this.appServices.account.username;
        if (data['qtycase'] == data['qtycase' + this.times.toString()] && data['qtypiece'] == data['qtypiece' + this.times.toString()]) {
          data['status' + this.times.toString()] = true;
        } else {
          data['status' + this.times.toString()] = false;
        }
        data['currentuser'] = this.appServices.account.username;
        this.appServices.insertStockDetail({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
          obj.component.notifyService.show('Process Done!');
          obj.component.loadStockCountDetailData();
        }).catch(err => {
          this.utilityService.handleError(err);
        })
      }
    }
  }

  doPrintStockCount_Times(type) {
    this.appServices.listStockDetail({ 'obj': JSON.stringify({ 'whseid': this.appServices.account.whseid, 'stockcountcode': this.selected_stockcount.stockcountcode }) }, this).then(function (obj) {
      let res = obj.response.json().res;
      res.forEach((value, index) => {
        value['keydate' + type] = new Date().toISOString().slice(0, 10);
        value['keywho' + type] = obj.component.appServices.account.username;
        value['currentuser'] = this.appServices.account.username;
        obj.component.appServices.updateStockDetail({ 'obj': JSON.stringify(value) }, obj.component).then(function (res) {
        }).catch(err => {
          this.utilityService.handleError(err);
        })
      });
      obj.component.router.navigate(['print/stockcounttime', obj.component.router.url, obj.component.selected_stockcount.stockcountcode, type]);
    }).catch(err => {
      this.utilityService.handleError(err);
    })
  }

  doExport(filename, data = []) {
    this.appServices.checkToken({ 'token': this.appServices.account.token }, this).then(function (success) {
      if (data.length > 0) {
        let temp = data;
        if (temp.length > 0) {
          new Angular2Csv(temp, filename + '_' + (new Date()).getFullYear() + (parseInt((new Date()).getMonth().toString()) + 1) + (new Date()).getDate() + '_' + (new Date()).getHours() + (new Date()).getMinutes() + (new Date()).getSeconds(), {
            headers: Object.keys(temp[0]),
            showTitle: true,
            fieldSeparator: ','
          })
        } else {
          success.component.notifyService.show('No record existed!', 'warning');
        }
      } else {
        success.component.appServices.listStockDetail({ 'obj': JSON.stringify({ 'whseid': success.component.appServices.account.whseid, 'stockcountcode': success.component.selected_stockcount.stockcountcode }) }, success.component).then(function (res) {
          let temp = success.component.InitStockCountDetail(res.response.json().res);
          if (temp.length > 0) {
            new Angular2Csv(temp, filename + '_' + (new Date()).getFullYear() + (parseInt((new Date()).getMonth().toString()) + 1) + (new Date()).getDate() + '_' + (new Date()).getHours() + (new Date()).getMinutes() + (new Date()).getSeconds(), {
              headers: Object.keys(temp[0]),
              showTitle: true,
              fieldSeparator: ','
            })
          } else {
            success.component.notifyService.show('No record existed!', 'warning');
          }
        }).catch(err => {
          this.utilityService.handleError(err);
        })
      }
    }).catch(err => {
      this.utilityService.handleError(err);
    });
  }

  InitStockCountDetail(data) {
    let list = [];
    let obj = {};
    data.forEach((value, index, arr) => {
      obj = {};
      obj['No.'] = value['rowno'] ? value['rowno'] : '';
      obj['Warehouse'] = value['whseid'] ? value['whseid'] : '';
      obj['PSC No'] = value['stockcountcode'] ? value['stockcountcode'] : '';
      obj['Owner'] = value['storerkey'] ? value['storerkey'] : '';
      obj['Location'] = value['location'] ? value['location'] : '';
      obj['Item Code'] = value['sku'] ? value['sku'] : '';
      obj['Case'] = value['qtycase'] ? value['qtycase'] : '0';
      obj['Piece'] = value['qtypiece'] ? value['qtypiece'] : '0';
      obj['Batch No'] = value['lottable01'] ? value['lottable01'] : '';
      obj['Production Date'] = value['lottable04'] ? this.datepipe.transform(value['lottable04'], 'MM-dd-yyyy') : '';
      obj['Expired Date'] = value['lottable05'] ? this.datepipe.transform(value['lottable05'], 'MM-dd-yyyy') : '';
      obj['Case 1'] = value['qtycase1'] ? value['qtycase1'] : '0';
      obj['Piece 1'] = value['qtypiece1'] ? value['qtypiece1'] : '0';
      obj['Date Print 1'] = value['keydate1'] ? this.datepipe.transform(value['keydate1'], 'MM-dd-yyyy') : '';
      obj['Who Print 1'] = value['keywho1'] ? value['keywho1'] : '';
      obj['Case 2'] = value['qtycase2'] ? value['qtycase2'] : '0';
      obj['Piece 2'] = value['qtypiece2'] ? value['qtypiece2'] : '0';
      obj['Date Print 2'] = value['keydate2'] ? this.datepipe.transform(value['keydate2'], 'MM-dd-yyyy') : '';
      obj['Who Print 2'] = value['keywho2'] ? value['keywho2'] : '';
      obj['Case 3'] = value['qtycase3'] ? value['qtycase3'] : '0';
      obj['Piece 3'] = value['qtypiece3'] ? value['qtypiece3'] : '0';
      obj['Date Print 3'] = value['keydate3'] ? this.datepipe.transform(value['keydate3'], 'MM-dd-yyyy') : '';
      obj['Who Print 3'] = value['keywho3'] ? value['keywho3'] : '';
      obj['Add Date'] = value['adddate'] ? this.datepipe.transform(value['adddate'], 'MM-dd-yyyy') : '';
      obj['Add Who'] = value['addwho'] ? value['addwho'] : '';
      obj['Edit Date'] = value['editdate'] ? this.datepipe.transform(value['editdate'], 'MM-dd-yyyy') : '';
      obj['Edit Who'] = value['editwho'] ? value['editwho'] : '';
      if (value['error']) obj['Error'] = value['error'];
      list.push(obj);
    })
    return list;
  }

}
