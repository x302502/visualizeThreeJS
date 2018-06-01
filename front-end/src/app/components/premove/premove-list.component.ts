import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { CompleterService, CompleterData } from 'ng2-completer';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

import * as $ from 'jquery';
import 'bootstrap';
import { DynamicComponent } from '../../common/dynamic-loader/dynamic-loader.model';
@Component({
  selector: 'app-premove-list',
  templateUrl: './premove-list.component.html',
  styleUrls: ['./premove-list.component.css']
})
export class PremoveListComponent implements OnInit, DynamicComponent {
  tabEmitter = null;
  data_preMove; count_preMove = 0; filter; currentPage = 1; itemsPerPage = 12; total = 0; data_temp;
  total_preMove; data_rows = [];data_location = [];
  constructor(private appServices: AppServices, 
    private notifyService: NotifyService,
    private completerService: CompleterService) { }

  ngOnInit() {
    this.loadLocationData();
    this.loadPreMoveData();
  }
  loadPreMoveData(param?: Object) {
    let skip = (this.currentPage-1)*this.itemsPerPage;
    let limit =  this.itemsPerPage;
    this.data_temp = null;
    if (param) {
      this.filter = $.extend(this.filter, param);
      let paramIndex = Object.keys(this.filter).indexOf(Object.keys(param)[0]);
      if (!(Object.values(this.filter)[paramIndex])) {
        delete this.filter[Object.keys(param)[0]];
      }
    }
    this.appServices.findPremove({'filter': JSON.stringify({'where': $.extend({'whseid': this.appServices.account.whseid, 'deleted': false}, this.filter), 'skip': skip})}, this).then(function(obj){
      let json = obj.response.json();
      obj.component.data_preMove = json.res;
      obj.component.total = json.total;
      console.log(obj.component.data_preMove);
    }).catch(function(err){
      err.component.notifyService.show(err.err.json().error.message, 'danger');
    })
  }
  loadLocationData() {
    this.appServices.findLocation({ 'filter': JSON.stringify({ 'where': { 'whseid': this.appServices.account.whseid, 'deleted': false } }) }, this).then(function (obj) {
        let res = obj.response.json().res;
        obj.component.data_location = obj.component.completerService.local(res, 'loc', 'loc');
        console.log(obj.component.data_location);
    }).catch((err) => {
        err.component.notifyService.show(err.err.json().error.message, 'danger');
    })
}
  onChoose(e, data) {
    if (e.target.checked) {
      this.data_rows.push(data);
      console.log(this.data_rows);
    }else {
      let index = this.data_rows.indexOf(data);
      this.data_rows.splice(index, 1);
    }
  }
  checkAll(e) {
    if(e.target.checked){
      this.data_rows = new Array();
      this.data_preMove.forEach(curr_data=>{
        curr_data.state = e.target.checked;
        this.data_rows.push(curr_data);
        console.log(this.data_rows);
      })
    } else {
      this.data_preMove.forEach(x=>x.state = e.target.checked);
      this.data_rows = [];
    }
    
  }
  isAllChecked(){
    if (this.data_preMove.length >0) {
      return this.data_preMove.every(_ => _.state);
    }
  }
  ConfirmPreMoveData() {
    const data = this.data_rows;
    console.log(data);
    if (data) {
      this.data_rows.forEach((value, index, arr) => {
        value['whseid'] = this.appServices.account.whseid;
        value['username'] = this.appServices.account.username;
        this.appServices.transactionQtyPreMove({'obj': JSON.stringify(value)}, this).then(function(obj) {
          const res = obj.response.res;
          obj.component.notifyService.show('Process Done');
          obj.component.loadPreMoveData();
        }).catch(function (err) {
          err.component.notifyService.show(err.err.json().err.message, 'danger');
        });
      });
    }
  }
  DeletePreMoveData() {
    const data = this.data_rows;
    console.log(data);
    if (data) {
      this.data_rows.forEach((value, index, arr) => {
        value['deleted'] = 1;
        value['editwho'] = this.appServices.account.username;
        this.appServices.updatePremove(value, this).then(function(obj){
          let res = obj.response.json().res;
          obj.component.notifyService.show('Process Done');
          obj.component.loadPreMoveData();
        }).catch(function(err){
          err.component.notifyService.show(err.err.json().error.message, 'danger');
        });
      });
    }
  }
}

