import { Component, OnInit, EventEmitter } from '@angular/core';
import { AppServices } from '../../app.services';
import * as moment from 'moment';
import * as uuid from 'uuid';
import * as $ from 'jquery';
import { ModalService } from '../modal.service';
import { CompleterService, CompleterData } from 'ng2-completer';
import { NotifyService } from '../../notify.service';
declare var Object: any;
@Component({
  selector: 'app-popup-asn',
  templateUrl: './popup-asn.component.html'
})
export class PopupAsnComponent implements OnInit {
  modalId = uuid.v4();
  date: Date; dataReceipt = []; dataShipment = [];
  data_itemAdded = [];
  data_addItem = new Object();
  list_dataOwner = []; storerkey; dataPopup = new Object(); data_init = new Object();
  show_add_item = false; data_receiptkey; receiptkey; typeOfShipment; data_purchase = new Array();data_orderkey = [];data_shipment =new Array();
  dataOrder;
  constructor(private modalService: ModalService,
    private appServices: AppServices, private completerService: CompleterService, private notifyService: NotifyService) { }

  ngOnInit() {
    this.loadReceiptData();
    this.loadShipmentData();
  }
  openCreate(date: Date) {
    this.date = date;
    //Gán asn thành rỗng
    // console.log(date);
    this.modalService.open(this.modalId);
  }
  openEdit(id: String) {
    //Gọi api lấy chi tiết asn
    this.modalService.open(this.modalId);
  }
  close() {
    this.modalService.close(this.modalId);
  }
  show() {
    this.show_add_item = !this.show_add_item;
  }
  // load receipt data with data has "New" status 
  loadReceiptData() {
    let filter;
    this.appServices.listReceiptForDock({
      'filter': JSON.stringify(filter),
      'obj': JSON.stringify({ 'whseid': this.appServices.account.whseid, 'deleted': false, 'listStorerkey': this.appServices.account.strOwners })
    }, this).then(obj => {
      // this.dataReceipt = obj.response.json().res;
      obj.response.json().res.forEach(element => {
        if (element.status == 0) {
          this.dataReceipt.push(element);
        }
      });
      // let res = obj.response.json().res;
      this.data_receiptkey = obj.component.completerService.local(this.dataReceipt, 'receiptkey', 'receiptkey');
    });
  }
  // load shipment data
  loadShipmentData() {
    let filter;
   
    this.appServices.listOrderForDock({
      'filter': JSON.stringify(filter),
      'obj': JSON.stringify({ 'whseid': this.appServices.account.whseid, 'deleted': false, 'listStorerkey': this.appServices.account.strOwners })
    }, this).then(obj => {
      this.dataOrder = obj.response.json().res;
      this.data_orderkey = obj.component.completerService.local(this.dataOrder, 'ORDERKEY', 'ORDERKEY');
      // console.log(this.dataOrder);
      
    }).catch((err) => {
      err.component.notifyService.show(err.err.json().error.message, 'danger');
  })
  }
  findElementReceipt() {
    // debugger
    var endtime = moment(this.date).add(Number(this.dataPopup.docklimit), 'm').toDate();

    var dataAddList = new Object();
    var data_element = this.dataReceipt.find(p => p.receiptkey == this.dataPopup.receiptkey);
    dataAddList.sort = this.data_purchase.length + 1;
    dataAddList.supplier = data_element.suppliercode;
    //   this.dataPopup.openqty = data_element.openqty;
    dataAddList.docklimit = this.dataPopup.docklimit;
    dataAddList.endtime = endtime;
    dataAddList.truckno = data_element.containerkey;
    dataAddList.begintime = this.date;
    dataAddList.drivername = data_element.DriverName;
    dataAddList.receiptkey = data_element.receiptkey
    dataAddList.weight = data_element.grossweight;
    dataAddList.po_key = data_element.externreceiptkey;
    dataAddList.storerkey = data_element.storerkey;
    dataAddList.whseid = this.appServices.account.whseid;
    dataAddList.username = this.appServices.account.username;
    dataAddList.deleted = false;
    dataAddList.begintimeSave =  moment(this.date).add(7, 'h').toDate();
    dataAddList.endtimeSave =  moment(endtime).add(7, 'h').toDate();
    this.data_purchase.push(dataAddList);
    this.dataPopup.receiptkey = "";
    // console.log(this.data_purchase);


  }

  deleteListPurchase(data) {
    var sort = parseInt(data.sort);
    var data = this.data_purchase.find(p => p.sort == sort);
    this.data_purchase.splice(this.data_purchase.indexOf(data), 1);
  }
  findElementOrder(){
  
    
    var endtime = moment(this.date).add(Number(this.dataPopup.docklimit), 'm').toDate();

    var dataTempOrder = new Object();
    var data_element = this.dataOrder.find(p => p.ORDERKEY == this.dataPopup.orderkey);
    
    dataTempOrder.sort = this.data_shipment.length + 1;
    dataTempOrder.customer = data_element.CONSIGNEEKEY;
    //   this.dataPopup.openqty = data_element.openqty;
    dataTempOrder.docklimit = this.dataPopup.docklimit;
    dataTempOrder.endtime = endtime;
    dataTempOrder.truckno = data_element.containerkey;
    dataTempOrder.begintime = this.date;
    dataTempOrder.voyagecode = data_element.VOYAGECODE;
    dataTempOrder.drivername = data_element.DriverName;
    dataTempOrder.orderkey = data_element.ORDERKEY;
    dataTempOrder.shipTo = data_element.SHIPCODE;
    dataTempOrder.sokey = data_element.EXTERNORDERKEY;
    dataTempOrder.storerkey = data_element.STORERKEY;
    dataTempOrder.whseid = this.appServices.account.whseid;
    dataTempOrder.username = this.appServices.account.username;
    dataTempOrder.deleted = false;
    dataTempOrder.begintimeSave =  moment(this.date).add(7, 'h').toDate();
    dataTempOrder.endtimeSave =  moment(endtime).add(7, 'h').toDate();
    this.data_shipment.push(dataTempOrder);
    console.log(this.data_shipment);
    this.dataPopup.orderkey = "";
  }
  deleteListShipment(data){
    var sort = parseInt(data.sort);
    var data = this.data_purchase.find(p => p.sort == sort);
    this.data_shipment.splice(this.data_shipment.indexOf(data), 1);
  }

  addItem() {
    this.data_addItem = new Object();
    this.data_addItem.sort = this.data_itemAdded.length + 1;
    this.data_addItem.itemsku = this.data_init.itemsku;
    this.data_addItem.qty = this.data_init.qty;
    this.data_addItem.netweight = this.data_init.netweight;
    this.data_addItem.grossweight = this.data_init.grossweight;
    this.data_addItem.cube = this.data_init.cube;
    this.data_itemAdded.push(this.data_addItem);
    this.data_init.itemsku = "";
    this.data_init.qty = 0;
    this.data_init.netweight = 0;
    this.data_init.grossweight = 0;
    this.data_init.cube = 0;

  }

  deleteItem(sort) {
    var sort1 = parseInt(sort);
    var data = this.data_itemAdded.find(p => p.sort == sort1);
    this.data_itemAdded.splice(this.data_itemAdded.indexOf(data), 1);
  }
  saveToDock() {
    // console.log(this.data_itemAdded);
    // console.log(data);
    var adddate = new Date();
    var   n  = adddate.getTimezoneOffset()/-60;
    this.data_purchase['adddate'] = moment( adddate ).add(n, 'h').toDate();
    this.data_shipment['adddate'] = moment( adddate ).add(n, 'h').toDate();
    // var newDateObj = moment(this.date).add(Number(dataPopup.docklimit), 'm').toDate();
    // console.log(newDateObj);
    // this.dataPopup.whseid = this.appServices.account.whseid;
    // this.dataPopup.begintime = this.date;
    // // this.dataPopup.endtime = newDateObj;
    // this.dataPopup.username = this.appServices.account.username;
    // this.dataPopup.deleted = false;
    if (this.dataPopup.typeOfShipment === 'inBound') {
      this.appServices.transactionDockInbound({ 'obj': JSON.stringify(this.data_purchase), 'objItem': JSON.stringify(this.data_itemAdded) }, this).then((obj) => {
        let res = obj.response.res;
        this.modalService.close(this.modalId);
        this.notifyService.show('Process Done');
      }).catch(function (err) {
        err.component.notifyService.show(err.err.json().err.message, 'warning');
      });
    }
    if (this.dataPopup.typeOfShipment === 'outBound') {
      this.appServices.transactionDockOutbound({ 'obj': JSON.stringify(this.data_shipment), 'objItem': JSON.stringify(this.data_itemAdded) }, this).then((obj) => {
        let res = obj.response.res;
        this.modalService.close(this.modalId);
        this.notifyService.show('Process Done');
      }).catch(function (err) {
        err.component.notifyService.show(err.err.json().err.message, 'warning');
      });
    }
  }
}
