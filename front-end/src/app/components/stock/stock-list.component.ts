import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { DatePipe } from '@angular/common';
import * as $ from 'jquery';
import 'bootstrap';
import { UtilityService } from '../../services/utility-service/utility.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements DynamicComponent {
  //#region Dynamic Component
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  //#endregion
  data_FullCount = []; total_FullCount = 0; itemsPerPage_FullCount = 12; currentPage_FullCount = 1;
  data_SKU_left = []; total_SKU_left = 0; itemsPerPage_SKU_left = 12; currentPage_SKU_left = 1;
  data_SKU_right = []; total_SKU_right = 0; itemsPerPage_SKU_right = 5; currentPage_SKU_right = 1;
  data_ZoneLoc_right = []; total_ZoneLoc_right = 0; itemsPerPage_ZoneLoc_right = 5; currentPage_ZoneLoc_right = 1;
  data_ZoneLoc_left = []; total_ZoneLoc_left = 0; itemsPerPage_ZoneLoc_left = 5; currentPage_ZoneLoc_left = 1;
  data_ChangeInDate = []; total_ChangeInDate = 0; itemsPerPage_ChangeInDate = 5; currentPage_ChangeInDate = 1;
  data_StockCount_right = []; total_StockCount_right = 0; itemsPerPage_StockCount_right = 5; currentPage_StockCount_right = 1;
  data_StockCount_left = [];
  selected_StockCount = []; arr_StockCount = '';
  selected_SKU = []; arr_SKU = '';
  selected_ZoneLoc = []; arr_Zone = ''; arr_Loc = '';
  data_owner_current; data_zoneloc_current;
  data_fromdate ; data_todate ; data_Lottable;

  ff_loc = ''; ff_sku = ''; ff_qtycase = ''; ff_qtypiece = ''; ff_lottable01 = ''; ff_lottable04 = ''; ff_lottable05 = '';
  propertyName_ff ; order_ff = 'ASC';

  fsl_sku = ''; fsl_descr = '';
  propertyName_fsl ; order_fsl = 'ASC';

  fsr_loc = ''; fsr_sku = ''; fsr_lottable01 = ''; fsr_lottable04 = ''; fsr_lottable05 = '';
  propertyName_fsr ; order_fsr = 'ASC';

  fzl_putawayzone = ''; fzl_loc = '';
  propertyName_fzl ; order_fzl = 'ASC';

  fzr_loc = ''; fzr_sku = ''; fzr_lottable01 = ''; fzr_lottable04 = ''; fzr_lottable05 = '';
  propertyName_fzr ; order_fzr = 'ASC';

  fc_loc = ''; fc_sku = ''; fc_lottable01 = ''; fc_lottable04 = ''; fc_lottable05 = '';
  propertyName_fc ; order_fc = 'ASC';

  fs_loc = ''; fs_sku = '';
  propertyName_fs ; order_fs = 'ASC';

  constructor(private router: Router,
    public appServices: AppServices,
    private notifyService: NotifyService,
    private datepipe: DatePipe,
    private utilityService: UtilityService) {
      this.itemsPerPage_FullCount = this.itemsPerPage_SKU_left  = this.itemsPerPage_SKU_right = this.itemsPerPage_ZoneLoc_left = this.itemsPerPage_ZoneLoc_right = this.itemsPerPage_ChangeInDate = this.itemsPerPage_StockCount_right
    }
    ngOnInit(){
      this.loadListFullCountData();
    }
    loadListFullCountData(param?: Object) {
      let skip = (this.currentPage_FullCount-1)*this.itemsPerPage_FullCount;
      let limit = this.itemsPerPage_FullCount;
      let filter;
      if(param) {
        if(this.ff_loc.length > 0) filter = $.extend(filter, {'lotxlocxid.loc like ': this.ff_loc});
        if(this.ff_sku.length > 0) filter = $.extend(filter, {'lotxlocxid.sku like ': this.ff_sku});
        if(this.ff_lottable01.length > 0) filter = $.extend(filter, {'lotattribute.lottable01 like ': this.ff_lottable01});
        if(this.ff_lottable04.length > 0) filter = $.extend(filter, {'lotattribute.lottable04 like': this.ff_lottable04});
        if(this.ff_lottable05.length > 0) filter = $.extend(filter, {'lotattribute.lottable05 like': this.ff_lottable05});
      }
      this.appServices.listFullCountStock({'obj': JSON.stringify({'whseid': this.appServices.account.whseid, 'skip': skip, 'limit': limit, 'order': this.propertyName_ff ? this.propertyName_ff + " " + this.order_ff : null}), 'filter': JSON.stringify(filter)}, this)
      .then(function(__){
        let json = __.response.json();
        __.component.data_FullCount = json.res;
        __.component.total_FullCount = json.total;
      }).catch((err)=>{
        this.utilityService.handleError(err);
      })
    }
    loadItemData(param?: Object){
      let skip = (this.currentPage_SKU_left-1)*this.itemsPerPage_SKU_left;
      let limit = this.itemsPerPage_SKU_left;
      this.selected_SKU = [];
      this.arr_SKU = '';
      let filter;
      if(param) {
        if(this.fsl_sku.length > 0) filter = $.extend(filter, {'sku': {like: this.fsl_sku}});
        if(this.fsl_descr.length > 0) filter = $.extend(filter, {'descr': {like: this.fsl_descr}});
      }
      this.appServices.findSku({'filter': JSON.stringify({'where': $.extend({'whseid': this.appServices.account.whseid, 'storerkey': this.data_owner_current, 'deleted':false}, filter), 'skip': skip, 'limit': limit, 'order': this.propertyName_fsl ? this.propertyName_fsl + " " + this.order_fsl : null})}, this)
      .then(function(__) {
        let json = __.response.json();
        __.component.data_SKU_left = json.res;
        __.component.total_SKU_left = json.total;
      }).catch(err=>{
        this.utilityService.handleError(err);
      })
    }
    loadListSKUData(param?: Object,type = 0, isQty = 0, isPrint = false) {
      let skip = (this.currentPage_SKU_right-1)*this.itemsPerPage_SKU_right;
      let limit = this.itemsPerPage_SKU_right;
      let filter;
      if(param) {
        if(this.fsr_loc.length > 0) filter = $.extend(filter, {'lotxlocxid.loc like ': this.fsr_loc});
        if(this.fsr_sku.length > 0) filter = $.extend(filter, {'lotxlocxid.sku like ': this.fsr_sku});
        if(this.fsr_lottable01.length > 0) filter = $.extend(filter, {'lotattribute.lottable01 like ': this.fsr_lottable01});
        if(this.fsr_lottable04.length > 0) filter = $.extend(filter, {'lotattribute.lottable04 like': this.fsr_lottable04});
        if(this.fsr_lottable05.length > 0) filter = $.extend(filter, {'lotattribute.lottable05 like': this.fsr_lottable05});
      }
      this.appServices.listSKUStock({'obj': JSON.stringify({'whseid': this.appServices.account.whseid, 'storerkey': this.data_owner_current, 'arr_sku': this.arr_SKU.substr(this.arr_SKU.length - 1) === ',' ? this.arr_SKU.substr(0, this.arr_SKU.length - 1) : "''",
      'skip': skip, 'limit': limit, 'order': this.propertyName_fsr ? this.propertyName_fsr + " " + this.order_fsr : null }),
      'filter': JSON.stringify(filter)}, this)
      .then(function(__){
        let json = __.response.json();
        __.component.data_SKU_right = json.res;
        __.component.total_SKU_right = json.total;
        if(isPrint){
          __.component.appServices.account['data_rptSKU'] = {'storerkey': __.component.data_owner_current, 'param': __.component.arr_SKU.substr(__.component.arr_SKU.length - 1) === ',' ? __.component.arr_SKU.substr(0, __.component.arr_SKU.length - 1) : "''" };
          __.component.insertStockCountData(type, isQty, __.component.data_SKU_right);
        }
      }).catch(err=>{
        this.utilityService.handleError(err);
      })
    }
    loadZoneLocData(param?: Object){
      let skip = (this.currentPage_ZoneLoc_left-1)*this.itemsPerPage_ZoneLoc_left;
      let limit = this.itemsPerPage_ZoneLoc_left;
      this.selected_ZoneLoc = [];
      this.arr_Zone = '';
      this.arr_Loc = '';

      let filter;
      if(param) {
        if(this.fzl_putawayzone.length > 0) filter = $.extend(filter, {'putawayzone': {like: this.fzl_putawayzone}});
        if(this.fzl_loc.length > 0) filter = $.extend(filter, {'loc': {like: this.fzl_loc}});
      }

      if(this.data_zoneloc_current === "0"){
        this.appServices.findZone({'filter': JSON.stringify({'where': $.extend({ 'whseid': this.appServices.account.whseid, 'deleted':false}, filter), 'skip': skip, 'limit': limit, 'order': this.propertyName_fzl ? this.propertyName_fzl + " " + this.order_fzl : null })}, this)
        .then(function(__) {
          let json = __.response.json();
          __.component.data_ZoneLoc_left = json.res;
          __.component.total_ZoneLoc_left = json.total;
        }).catch(err=>{
          this.utilityService.handleError(err);
        })
      } else if(this.data_zoneloc_current === "1") {
        this.appServices.findLocation({'filter': JSON.stringify({'where': $.extend({ 'whseid': this.appServices.account.whseid, 'deleted':false}, filter), 'skip': skip, 'limit': limit, 'order': this.propertyName_fzl ? this.propertyName_fzl + " " + this.order_fzl : null })}, this)
        .then(function(__) {
          let json = __.response.json();
          __.component.data_ZoneLoc_left = json.res;
          __.component.total_ZoneLoc_left = json.total;
        }).catch(err=>{
          this.utilityService.handleError(err);
        })
      }
    }
    loadListZoneLocData(param?: Object,type = 0, isQty = 0, isPrint = false) {
      let skip = (this.currentPage_ZoneLoc_right-1)*this.itemsPerPage_ZoneLoc_right;
      let limit = this.itemsPerPage_ZoneLoc_right;
      let filter;
      if(param) {
        if(this.fzr_loc.length > 0) filter = $.extend(filter, {'lotxlocxid.loc like ': this.fzr_loc});
        if(this.fzr_sku.length > 0) filter = $.extend(filter, {'lotxlocxid.sku like ': this.fzr_sku});
        if(this.fzr_lottable01.length > 0) filter = $.extend(filter, {'lotattribute.lottable01 like ': this.fzr_lottable01});
        if(this.fzr_lottable04.length > 0) filter = $.extend(filter, {'lotattribute.lottable04 like': this.fzr_lottable04});
        if(this.fzr_lottable05.length > 0) filter = $.extend(filter, {'lotattribute.lottable05 like': this.fzr_lottable05});
      }
      this.appServices.listZoneLocStock({'obj': JSON.stringify({'whseid': this.appServices.account.whseid, 'arr_zone': this.arr_Zone.substr(this.arr_Zone.length - 1) === ',' ? this.arr_Zone.substr(0, this.arr_Zone.length - 1) : "''",
      'arr_loc': this.arr_Loc.substr(this.arr_Loc.length - 1) === ',' ? this.arr_Loc.substr(0, this.arr_Loc.length - 1) : "''", 'skip': skip, 'limit': limit, 'order': this.propertyName_fzr ? this.propertyName_fzr + " " + this.order_fzr : null }), 'filter':JSON.stringify(filter)}, this)
      .then(function(__){
        let json = __.response.json();
        __.component.data_ZoneLoc_right = json.res;
        __.component.total_ZoneLoc_right = json.total;
        if(isPrint){
          __.component.appServices.account['data_rptZone'] = {
            'param': {
              'arr_zone': __.component.arr_Zone.substr(__.component.arr_Zone.length - 1) === ',' ? __.component.arr_Zone.substr(0, __.component.arr_Zone.length - 1) : "''",
              'arr_loc': __.component.arr_Loc.substr(__.component.arr_Loc.length - 1) === ',' ? __.component.arr_Loc.substr(0, __.component.arr_Loc.length - 1) : "''" }
            };
            __.component.insertStockCountData(type, isQty, __.component.data_ZoneLoc_right);
          }
        }).catch(err=>{
          this.utilityService.handleError(err);
        })
      }
      loadListChangeInDateData(param?: Object ,type = 0,  isQty = 0, isPrint = false){
        let skip = (this.currentPage_ChangeInDate-1)*this.itemsPerPage_ChangeInDate;
        let limit = this.itemsPerPage_ChangeInDate;
        let filter;
        if(param) {
          if(this.fc_loc.length > 0) filter = $.extend(filter, {'lotxlocxid.loc like ': this.fc_loc});
          if(this.fc_sku.length > 0) filter = $.extend(filter, {'lotxlocxid.sku like ': this.fc_sku});
          if(this.fc_lottable01.length > 0) filter = $.extend(filter, {'lotattribute.lottable01 like ': this.fc_lottable01});
          if(this.fc_lottable04.length > 0) filter = $.extend(filter, {'lotattribute.lottable04 like': this.fc_lottable04});
          if(this.fc_lottable05.length > 0) filter = $.extend(filter, {'lotattribute.lottable05 like': this.fc_lottable05});
        }
        this.appServices.listChangeInDateStock({'obj': JSON.stringify({'whseid': this.appServices.account.whseid, 'storerkey': this.data_owner_current, 'fromdate': this.data_fromdate, 'todate': this.data_todate, 'skip': skip, 'limit': limit, 'order': this.propertyName_fc ? this.propertyName_fc + " " + this.order_fc : null}),
         'filter':JSON.stringify(filter)}, this)
        .then(function(__){
          let json = __.response.json();
          __.component.data_ChangeInDate = json.res;
          __.component.total_ChangeInDate = json.total;
          if(isPrint){
            __.component.appServices.account['data_rptChangeInDate'] = {
              'storerkey': __.component.data_owner_current,
              'param': {
                'fromdate': __.component.data_fromdate,
                'todate': __.component.data_todate
              }
            };
            __.component.insertStockCountData(type, isQty, __.component.data_ChangeInDate);
          }
        }).catch(err=>{
          this.utilityService.handleError(err);
        })
      }
      loadLottableData(){
        this.selected_StockCount = [];
        this.arr_StockCount = '';
        this.data_StockCount_left = [];

        this.appServices.findOwner({'token': this.appServices.account.token, 'filter': JSON.stringify({'where': { 'whseid': this.appServices.account.whseid, 'storerkey': this.data_owner_current, 'deleted':false}, })}, this)
        .then(function(__) {
          let json = __.response.json();
          __.component.data_Lottable = JSON.parse(json.res[0].lottable);
          for(let key in __.component.data_Lottable){
            if(__.component.data_Lottable[key].active){
              __.component.data_Lottable[key].label = __.component.data_Lottable[key].label !== '' ? __.component.data_Lottable[key].label : key;
              __.component.data_Lottable[key].key = key;
              __.component.data_StockCount_left.push(__.component.data_Lottable[key]);
              __.component.total_StockCount_left++;
            }
          }
        }).catch(err=>{
          this.utilityService.handleError(err);
        });
      }
      loadListStockCountData(param ,type = 0, isQty = 0, isPrint = false) {
        let skip = (this.currentPage_StockCount_right-1)*this.itemsPerPage_StockCount_right;
        let limit = this.itemsPerPage_StockCount_right;
        let filter;
        if(param) {
          if(this.fs_loc.length > 0) filter = $.extend(filter, {'lotxlocxid.loc like ': this.fs_loc});
          if(this.fs_sku.length > 0) filter = $.extend(filter, {'lotxlocxid.sku like ': this.fs_sku});
        }
        this.appServices.listStockCountStock({'obj': JSON.stringify({'whseid': this.appServices.account.whseid, 'storerkey': this.data_owner_current,
        'arr_stockcount': this.arr_StockCount, 'skip': skip, 'limit': limit, 'order': this.propertyName_fs ? this.propertyName_fs + " " + this.order_fs : null }), 'filter':JSON.stringify(filter)}, this)
        .then(function(__){
          let json = __.response.json();
          __.component.data_StockCount_right = json.res;
          __.component.total_StockCount_right = json.total;
          if(isPrint){
            __.component.appServices.account['data_rptStock'] = {
              'storerkey': __.component.data_owner_current,
              'param': __.component.arr_StockCount
            };
            __.component.insertStockCountData(type, isQty, __.component.data_StockCount_right);
          }
        }).catch(err=>{
          this.utilityService.handleError(err);
        });
      }

      insertStockCountData(type, isQty, data){
        let temp_data = {};
        temp_data['whseid'] = this.appServices.account.whseid;
        temp_data['addwho'] = this.appServices.account.username;
        temp_data['status'] = 0;
        temp_data['currentuser'] = this.appServices.account.username;
        this.appServices.insertStock({'obj': JSON.stringify(temp_data)}, this).then(function(__) {
          let res = __.response.json().res;
          data.forEach((value, index, arr)=>{
            value['whseid'] = __.component.appServices.account.whseid;
            value['addwho'] = __.component.appServices.account.username;
            value['stockcountcode'] = res;
            value['rowno'] = index + 1;
            if(!value['lottable04']){
              delete value['lottable04'];
            }
            if(!value['lottable05']){
              delete value['lottable05'];
            }
            __.component.appServices.insertManyStockDetail({'obj': JSON.stringify(value)}, this).then(function(res_detail) {
            }).catch(err => {
              this.utilityService.handleError(err);
            })
          })
          __.component.routerReportPage(type, res, isQty);
          __.component.notifyService.show('Process Done <br /> New StockCountCode is: <br /> <b>' + res + '</b>');
        }).catch(err=>{
          this.utilityService.handleError(err);
        })
      }

      doSearch(key, e){
        let param = {};
        param['lotattribute.'+key+' like'] = e
        this.loadListStockCountData(param);
      }

      doPreview(type, isQty = 0, isPrint = false){
        switch(type){
          case 1:{
            this.arr_SKU = '';
            this.selected_SKU.forEach((value, index, arr)=>{
              this.arr_SKU += "'"+ value.sku +"'"+ ",";
            })
            this.loadListSKUData('', type, isQty, isPrint);
            break;
          }
          case 2:{
            this.arr_Zone = '';
            this.arr_Loc = '';
            this.selected_ZoneLoc.forEach((value, index, arr)=>{
              if(value.loc){
                this.arr_Loc += "'"+ value.loc +"'"+ ",";
              } else {
                this.arr_Zone += "'"+ value.putawayzone +"'"+ ",";
              }
            })
            this.loadListZoneLocData('', type, isQty, isPrint);
            break;
          }
          case 3:{
            this.loadListChangeInDateData('', type, isQty, isPrint);
            break;
          }
          case 4:{
            this.arr_StockCount = '';
            this.selected_StockCount.forEach((value, index, arr)=>{
              if(value.key == 'lottable04' || value.key == 'lottable05' || value.key == 'lottable11' || value.key == 'lottable12'  ){
                if(value.value){
                  this.arr_StockCount += "," + "DATE_FORMAT(" + "lotattribute." + value.key + " , '%m-%d-%Y')" + " as " + "'" + value.label + "'" ;
                } else {
                  this.arr_StockCount += "," + "lotattribute." + value.key + " as " + "'" + value.label + "'" ;
                }
              } else {
                this.arr_StockCount += "," + "lotattribute." + value.key + " as " + "'" + value.label + "'" ;
              }
            })
            this.loadListStockCountData('', type, isQty, isPrint);
            break;
          }
          default:{
            break;
          }
        }
      }

      onChoose(e, data, type){
        switch(type){
          case 1:{
            if(e.target.checked) {
              this.selected_SKU.push(data);
            }
            else {
              let index = this.selected_SKU.indexOf(data);
              this.selected_SKU.splice(index, 1);
            }
            break;
          }
          case 2:{
            if(e.target.checked) {
              this.selected_ZoneLoc.push(data);
            }
            else {
              let index = this.selected_ZoneLoc.indexOf(data);
              this.selected_ZoneLoc.splice(index, 1);
            }
            break;
          }
          case 4:{
            if(e.target.checked) {
              this.selected_StockCount.push(data);
            }
            else {
              let index = this.selected_StockCount.indexOf(data);
              this.selected_StockCount.splice(index, 1);
            }
            this.doPreview(4);
            break;
          }
          default:{
            break;
          }
        }
      }
      checkAll(e, type) {
        switch(type){
          case 1:{
            if(e.srcElement.checked){
              this.data_SKU_left.forEach(curr_data=>{
                curr_data.state = e.target.checked;
                if(!this.selected_SKU.includes(curr_data)){
                  this.selected_SKU.push(curr_data);
                }
              })
            } else {
              this.data_SKU_left.forEach(x=>x.state = e.target.checked);
              this.selected_SKU = [];
            }
            break;
          }
          case 2:{
            if(e.srcElement.checked){
              this.data_ZoneLoc_left.forEach(curr_data=>{
                curr_data.state = e.target.checked;
                if(!this.selected_ZoneLoc.includes(curr_data)){
                  this.selected_ZoneLoc.push(curr_data);
                }
              })
            } else {
              this.data_ZoneLoc_left.forEach(x=>x.state = e.target.checked);
              this.selected_ZoneLoc = [];
            }
            break;
          }
          case 4:{
            if(e.srcElement.checked){
              this.data_StockCount_left.forEach(curr_data=>{
                curr_data.state = e.target.checked;
                if(!this.selected_StockCount.includes(curr_data)){
                  this.selected_StockCount.push(curr_data);
                }
              })
            } else {
              this.data_StockCount_left.forEach(x=>x.state = e.target.checked);
              this.selected_StockCount = [];
            }
            this.doPreview(4);
            break;
          }
          default:{
            break;
          }
        }
      }
      isAllChecked(type) {
        switch(type){
          case 1:{
            return this.data_SKU_left.every(_ => _.state);
          }
          case 2:{
            return this.data_ZoneLoc_left.every(_ => _.state);
          }
          case 4:{
            return this.data_StockCount_left.every(_ => _.state);
          }
          default:{
            break;
          }
        }
      }

      changeOwner(data){
        this.loadItemData();
        this.loadLottableData();
      }
      changeZoneLoc(data){
        this.propertyName_fzl = "";
        this.loadZoneLocData();
      }

      doExport(type){
        switch(type){
          case 0:{
            if(this.data_FullCount.length > 0){
              let data = this.InitExport(this.data_FullCount);
              new Angular2Csv(data, 'Full Count_' + (new Date()).getFullYear() + '-' + (parseInt((new Date()).getMonth().toString()) + 1) + '-' + (new Date()).getDate() + (new Date()).getSeconds(), {
                headers: Object.keys(data[0]),
                showTitle: true,
                fieldSeparator: ','
              })
            } else {
              this.notifyService.show('No record existed!', 'warning');
            }
            break;
          }
          case 1:{
            if(this.data_SKU_right.length > 0){
              let data = this.InitExport(this.data_SKU_right);
              new Angular2Csv(data, 'SKU' + (new Date()).getFullYear() + '-' + (parseInt((new Date()).getMonth().toString()) + 1) + '-' + (new Date()).getDate() + (new Date()).getSeconds(), {
                headers: Object.keys(data[0]),
                showTitle: true,
                fieldSeparator: ','
              })
            } else {
              this.notifyService.show('No record existed!', 'warning');
            }
            break;
          }
          case 2:{
            if(this.data_ZoneLoc_right.length > 0){
              let data = this.InitExport(this.data_ZoneLoc_right);
              new Angular2Csv(data, 'Zone Loc' + (new Date()).getFullYear() + '-' + (parseInt((new Date()).getMonth().toString()) + 1) + '-' + (new Date()).getDate() + (new Date()).getSeconds(), {
                headers: Object.keys(data[0]),
                showTitle: true,
                fieldSeparator: ','
              })
            } else {
              this.notifyService.show('No record existed!', 'warning');
            }
            break;
          }
          case 3:{
            if(this.data_ChangeInDate.length > 0){
              let data = this.InitExport(this.data_ChangeInDate);
              new Angular2Csv(data, 'Change In Date' + (new Date()).getFullYear() + '-' + (parseInt((new Date()).getMonth().toString()) + 1) + '-' + (new Date()).getDate() + (new Date()).getSeconds(), {
                headers: Object.keys(data[0]),
                showTitle: true,
                fieldSeparator: ','
              })
            } else {
              this.notifyService.show('No record existed!', 'warning');
            }
            break;
          }
          case 4:{
            if(this.data_StockCount_right.length > 0){
              let data = this.InitExport(this.data_ChangeInDate);
              new Angular2Csv(data, 'Stock Count' + (new Date()).getFullYear() + '-' + (parseInt((new Date()).getMonth().toString()) + 1) + '-' + (new Date()).getDate() + (new Date()).getSeconds(), {
                headers: Object.keys(data[0]),
                showTitle: true,
                fieldSeparator: ','
              })
            } else {
              this.notifyService.show('No record existed!', 'warning');
            }
            break;
          }
          default:{
            break;
          }
        }
      }

      InitExport(data){
        let list = [];
        let obj = {};
        data.forEach((value, index, arr)=>{
          obj = {};
          obj['Bin'] = value['location']?value['location']:'';
          obj['Item Code'] = value['sku']?value['sku']:'';
          obj['Quantity Case'] = value['qtycase']?value['qtycase']:'';
          obj['Quantity Pieces'] = value['qtypiece']?value['qtypiece']:'';
          obj['Producttion Date'] = value['lottable04']?this.datepipe.transform(value['lottable04'], 'MM-dd-yyyy'):'';
          obj['Batch No'] = value['lottable01']?value['lottable01']:'';
          obj['Expired Date'] = value['lottable05']?this.datepipe.transform(value['lottable05'], 'MM-dd-yyyy'):'';
          if(value['error']) obj['error'] = value['error'];
          list.push(obj);
        })
        return list;
      }

      routerReportPage(type, stockcountcode, isQty){
        switch(type){
          case 0:{
            this.router.navigate(['print/fullcount', this.router.url, stockcountcode, isQty]);
            break;
          }
          case 1:{
            this.router.navigate(['print/skucount', this.router.url, stockcountcode, isQty]);
            break;
          }
          case 2:{
            this.router.navigate(['print/zonecount', this.router.url, stockcountcode, isQty]);
            break;
          }
          case 3:{
            this.router.navigate(['print/changeindatecount', this.router.url, stockcountcode, isQty]);
            break;
          }
          case 4:{
            this.router.navigate(['print/stockcount', this.router.url, stockcountcode, isQty]);
            break;
          }
          default:{
            break;
          }
        }

      }

      doPrint(type, isQty = 0, isPrint = true){
        switch(type){
          case 0: {
            if(this.data_FullCount.length > 0){
              this.insertStockCountData(type, isQty, this.data_FullCount);
            } else {
              this.notifyService.show('No record existed!', 'warning');
            }
            break;
          }
          case 1:{
            if(this.selected_SKU.length > 0){
              this.doPreview(type, isQty, isPrint);
            } else {
              this.notifyService.show('No record existed!', 'warning');
            }
            break;
          }
          case 2:{
            if(this.selected_ZoneLoc.length > 0){
              this.doPreview(type, isQty, isPrint);
            } else {
              this.notifyService.show('No record existed!', 'warning');
            }
            break;
          }
          case 3:{
            if(this.data_owner_current && this.data_fromdate && this.data_todate){
              this.doPreview(type, isQty, isPrint);
            } else {
              this.notifyService.show('No record existed!', 'warning');
            }
            break;
          }
          case 4:{
            if(this.data_owner_current){
              this.doPreview(type, isQty, isPrint);
            } else {
              this.notifyService.show('No record existed!', 'warning');
            }
            break;
          }
          default:{
            break;
          }
        }
      }

    }
