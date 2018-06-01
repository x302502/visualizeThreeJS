import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';

import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { CheckinDetailComponent } from './check-in-detail.component';

import * as $ from 'jquery';
import 'bootstrap';
import { GridOption } from '../../common/grid-control/grid-control';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { SocketService, ISocketData } from '../../services/socket.service';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
@Component({
  selector: 'app-check-in-list',
  templateUrl: './check-in-list.component.html',
  styleUrls: ['./check-in-list.component.css']
})
export class CheckInListComponent implements DynamicComponent {
  //#region Dynamic Component
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  //#endregion

  // data: any;
  // Subcription
  editRow: any = ''; currentPage = 1; itemsPerPage = 12; total = 0; data_temp; currentPage_detail = 1; itemsPerPage_detail = 5; filter; data_codelkup;
  data_checkIn; checkin_temp; checkout_temp; ff_gateno = ''; ff_fullname = ''; ff_passportnumber = ''; ff_checkin = ''; ff_checkout = ''; ff_truckno = ''; ff_trucktype = '';
  ff_container = ''; ff_qty = ''; ff_status = '';
  order_ff = 'ASC'; propertyName_ff = ''; get_hour_offset;

  constructor(private appServices: AppServices,
    private notifyService: NotifyService
  ) { }

  ngOnInit() {
    this.loadCheckinData();
    this.loadTruckType();
  }
  newCheckinData(data) {
    // data.checkin = new Date();
    var n = this.checkin_temp.getTimezoneOffset() / -60;

    // data.checkin = this.datePipe.transform(data.checkin, "yyyy-MM-dd HH:mm");
    data.checkin = moment(this.checkin_temp).add(n, 'h').toDate();
    // console.log(data.checkin)
    data.whseid = this.appServices.account.whseid;
    data.tagid = uuid();
    data.username = this.appServices.account.username;
    data.deleted = false;
    data.status = "Check In";
    // data.checkin = new Date(data.checkin);
    // data.checkout = this.checkout_temp;
    this.appServices.insertCheckin({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
      const res = obj.response.res;
      obj.component.notifyService.show('Process Done');
      obj.component.loadCheckinData();
      $('#ModalCreateNewCheckin').modal('hide');
    }).catch(function (err) {
      err.component.notifyService.show(err.err.json().err.message, 'danger');
    });
  }
  onChoose_checkin(e) {
    if (e.target.checked) {

      this.checkin_temp = new Date();
    }
  }
  onChoose_checkout(e) {
    if (e.target.checked) {

      this.checkout_temp = new Date();
      console.log(this.checkout_temp);

    }
  }
  Edit(data) {
    this.editRow = data;
    console.log(this.editRow);
  }
  BacktoEdit(data) {
    this.editRow = !data;
  }
  cancel(data) {
    this.editRow = !data;
    this.loadCheckinData();
  }

  loadCheckinData(param?: Object) {
    let skip = (this.currentPage - 1) * this.itemsPerPage;
    let limit = Number(this.itemsPerPage);
    this.data_temp = null;
    let filter;
    let n;
    var checkinStr; var checkoutStr;
    if (param) {
      if (this.ff_gateno.length > 0) {
        filter = $.extend(filter, { 'checkin.gateno like ': '%' + this.ff_gateno + '%' })
      }
      if (this.ff_fullname.length > 0) {
        filter = $.extend(filter, { 'checkin.fullname like ': '%' + this.ff_fullname + '%' })
      }
      if (this.ff_passportnumber.length > 0) {
        filter = $.extend(filter, { 'checkin.passportnumber like ': '%' + this.ff_passportnumber + '%' })
      }
      if (this.ff_checkin.length > 0) {
        checkinStr = this.ff_checkin.substring(4, this.ff_checkin.length) + '-' + this.ff_checkin.substring(2, 4) + '-' + this.ff_checkin.substring(0, 2);
        filter = $.extend(filter, { 'checkin.checkin like ': checkinStr + '%' })
      }
      if (this.ff_checkout.length > 0) {
        checkoutStr = this.ff_checkout.substring(4, this.ff_checkout.length) + '-' + this.ff_checkout.substring(2, 4) + '-' + this.ff_checkout.substring(0, 2);
        filter = $.extend(filter, { 'checkin.checkout like ': checkoutStr + '%' })
      }
      if (this.ff_truckno.length > 0) {
        filter = $.extend(filter, { 'checkin.truckno like ': '%' + this.ff_truckno + '%' })
      }
      if (this.ff_container.length > 0) {
        filter = $.extend(filter, { 'checkin.container like ': '%' + this.ff_container + '%' })
      }
      if (this.ff_qty.length > 0) {
        n = this.ff_qty.search(">") && this.ff_qty.search(">=") && this.ff_qty.search("<") && this.ff_qty.search("<=");
        if (n == -1) {
          filter = $.extend(filter, { 'checkin.qty = ': this.ff_qty })
        } else {
          filter = $.extend(filter, { 'checkin.qty ': this.ff_qty })
        }
      }
      if (this.ff_status.length > 0) {
        filter = $.extend(filter, { 'checkin.status like ': '%' + this.ff_status + '%' })
      }
      if (this.ff_trucktype.length > 0) {
        filter = $.extend(filter, { 'checkin.trucktype like ': '%' + this.ff_trucktype + '%' })
      }
      // this.filter = $.extend(this.filter, param);
      // let paramIndex = Object.keys(this.filter).indexOf(Object.keys(param)[0]);
      // if (!(Object.values(this.filter)[paramIndex])) {
      //   delete this.filter[Object.keys(param)[0]];
      // }
    }
    this.appServices.listCheckin({ 'filter': JSON.stringify(filter), 'obj': JSON.stringify({ 'whseid': this.appServices.account.whseid, 'skip': skip, 'limit': limit, 'order': this.propertyName_ff ? this.propertyName_ff + " " + this.order_ff : null }) }, this)
      .then(function (obj) {
        let json = obj.response.json();
        obj.component.data_checkIn = json.res;
        // obj.component.data_checkIn.forEach(element => {
        //   element.CHECKIN = obj.component.datePipe.transform(element.CHECKIN, "yyyy-MM-dd HH:mm");
        //   element.CHECKOUT = obj.component.datePipe.transform(element.CHECKOUT, "yyyy-MM-dd HH:mm");
        // });
        // console.log(obj.component.data_checkIn);

        obj.component.total = json.total;
      }).catch(function (err) {
        err.component.notifyService.show(err.err.json().error.message, 'danger');
      });
    this.loadTruckType();
  }
  loadTruckType(param?: Object, skip = 0) {
    this.appServices.findCodelkup({
      'filter': JSON.stringify({
        'where': $.extend({
          'whseid': this.appServices.account.whseid,
          'listname': 'TRUCKTYPE',
          'deleted': false,
          'skip': 0
        }, this.filter), 'skip': skip
      })
    }, this).then(function (obj) {
      obj.component.data_codelkup = obj.response.json().res;
    }).catch(function (err) {
      err.component.notifyService.show(err.err.json().error.message, 'danger');
    });
  }
  UpdateCheckinRow(data) {
    let n = this.checkout_temp.getTimezoneOffset() / -60;
    data.CHECKOUT = moment(this.checkout_temp).add(n, 'h').toDate();
    data['whseid'] = this.appServices.account.whseid;
    data['username'] = this.appServices.account.username;
    data['deleted'] = false;
    console.log(data);
    if (!data.CHECKOUT) {
      this.appServices.updateCheckin({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
        const res = obj.response.res;
        obj.component.notifyService.show('Process Done');
        obj.component.loadCheckinData();
      }).catch(function (err) {
        err.component.notifyService.show(err.err.json().err.message, 'danger');
      });
    } else {
      data.status = 'Check Out';

      this.appServices.updateCheckin({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
        const res = obj.response.res;
        obj.component.notifyService.show('Process Done');
        obj.component.loadCheckinData();
      }).catch(function (err) {
        err.component.notifyService.show(err.err.json().err.message, 'danger');
      });
    }
  }
  DeleteCheckinData(data) {
    data['whseid'] = this.appServices.account.whseid;
    data['username'] = this.appServices.account.username;
    data['deleted'] = true;
    console.log(data);
    this.appServices.updateCheckin({ 'obj': JSON.stringify(data) }, this).then(function (obj) {
      const res = obj.response.res;
      obj.component.notifyService.show('Process Done');
      obj.component.loadCheckinData();
      $('#modalDelete').modal('hide');
    }).catch(function (err) {
      err.component.notifyService.show(err.err.json().err.message, 'danger');
    });
  }
}
