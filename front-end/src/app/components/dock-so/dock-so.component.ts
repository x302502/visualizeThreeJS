import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter } from '@angular/core';
import { ScheduleControlComponent } from '../../common/schedule-control/schedule-control.component';
import { ScheduleOption } from '../../common/schedule-control/shared/schedule-control.model';
import { v4 as uuid } from 'uuid';
import { EventObjectInput } from 'fullcalendar';
import { AppServices } from './../../app.services';
import { Router } from '@angular/router';
// import { HttpClient, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Rx';
// import { DataTableDirective } from 'angular-datatables';
import 'rxjs/add/operator/map';

import * as $ from 'jquery';
import { element } from 'protractor';
import 'bootstrap';
import { PopupAsnComponent } from '../../common/popup-asn/popup-asn.component';
import { DynamicTabItem, DynamicComponent } from '../../common/dynamic-loader/dynamic-loader.model';
import { SocketService, ISocketData } from '../../services/socket.service';
import { NotifyService } from '../../notify.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-dock-so',
  templateUrl: './dock-so.component.html',
  styleUrls: ['./dock-so.component.css']
})
export class DockSoComponent implements OnInit, DynamicComponent {
   dataShipment; dataShipment_no_beginTime = []; dataShipment_show = [];
    @ViewChild('scheduleControl') schedule: ScheduleControlComponent;
    @ViewChild('popupASN') popupASN: PopupAsnComponent;

  //#region Dynamic Component
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  //#endregion
  constructor(private appServices: AppServices,
    private router: Router,
    private socketService: SocketService,
    private notifyService: NotifyService,
    private datePipe: DatePipe) {
      this.socketService.emitter.subscribe((socketData: ISocketData) => {
        if (socketData.code === "DOCK_SO_CREATE") {
            // console.log(socketData.data);
            
            let order = socketData.data;
            this.schedule.renderEvent({
                id: uuid(),
                title: order.ORDERKEY,
                start: order.begintime,
                end: order.endtime,
                backgroundColor: this.randomColor()
            });
            this.removeData(order);
        } else if (socketData.code === "DOCK_SO_CREATE") {
            socketData.data;
        }
    });
     }

  ngOnInit() {
      
    this.loadShipmentData();
  }
  loadShipmentData(param?: Object) {
    let filter;
    this.appServices.listDockSO({
        'filter': JSON.stringify(filter),
        'obj': JSON.stringify({ 'whseid': this.appServices.account.whseid, 'deleted': false, 'listStorerkey': this.appServices.account.strOwners })
    }, this).then(obj => {
        this.dataShipment = obj.response.json().res;
        this.dataShipment.forEach(element => {
            if (element.BEGINTIME == null) {
                this.dataShipment_no_beginTime.push(element);
                // console.log(this.dataShipment_no_beginTime);/
            }
            else {
                element.BEGINTIME = moment(element.BEGINTIME).toDate();
                element.ENDTIME = moment(element.ENDTIME).toDate();
                this.dataShipment_show.push(element);
                // console.log(this.dataShipment_show);
                
            }
        });
        this.loadDataOrderDock();
    });
}
loadDataOrderDock() {
  let options = new ScheduleOption();
  this.dataShipment_show.forEach(element => {
      if (element.BEGINTIME) {
          options.events.push({
              id: element.ORDERKEY,
              start: element.BEGINTIME,
              end: element.ENDTIME,
              title: element.ORDERKEY,
              backgroundColor: '#f1ce73',
              color: '#FFF',
              tooltipItems: [
                  {
                      title: 'D/O',
                      value: element.EXTERNORDERKEY
                  },
                  {
                      title: 'Company',
                      value: element.STORERKEY
                  },
                  {
                      title: 'Customer',
                      value: element.CONSIGNEEKEY
                  }
              ]
          });

      }
  });
  this.schedule.draw(options);
}
addSOEvents() {
  this.schedule.externalEvent.clear();
  let externalEvents = [];
  this.dataShipment_no_beginTime.forEach(element => {
      externalEvents.push({
          title: element.ORDERKEY,
          data: element
      });
  })
  this.schedule.externalEvent.add(externalEvents);
}
drop(event) {
  // event.date
  // event.data

  // let data = {};
  // event.data['begintime'] = event.date;
  // event.data['endtime'] = next;
//   console.log(event);

  var adddate = new Date();
  var n = adddate.getTimezoneOffset() / -60;
  let next = new Date(event.date);
  next.setHours(next.getHours() + 1);
  event.data['begintime'] = moment(event.date).add(n, 'h').toDate();
  event.data['endtime'] = moment(next).add(n, 'h').toDate();
  event.data['username'] = this.appServices.account.username;
    //   console.log('noooooo');
      //update time for Order table when drop
      this.appServices.updateTimeOrderForDock({ 'obj': JSON.stringify(event.data) }, this).then(() => {
          this.socketService.send({
              code: 'DOCK_SO_CREATE',
              data: event.data
          });
          this.notifyService.show('Process Done');
      }).catch(function (err) {
          err.component.notifyService.show(err.err.json().err.message, 'warning');
      });
}
removeData(item) {
    let index = this.dataShipment_no_beginTime.map(function (e) {
        return e.ORDERKEY
    }).indexOf(item.ORDERKEY);
    this.dataShipment_no_beginTime.splice(index, 1);
    // this.schedule.externalEvent.remove(index);
    this.addSOEvents();
    // this.schedule.externalEvent.splice(externalEvents);
}
updateEvent(event: EventObjectInput) {
    var adddate = new Date();
    var n = adddate.getTimezoneOffset() / -60;
    // event['begintime'] = event.start;
    event['begintime'] = moment(event.start).add(n, 'h').toDate();
    // event['endtime'] = event.end;
    event['endtime'] = moment(event.end).add(n, 'h').toDate();
    event['WHSEID'] = this.appServices.account.whseid;
    event['ORDERKEY'] = event.title;
    console.log(event);
    this.appServices.updateTimeOrderForDock({ 'obj': JSON.stringify(event) }, this).then(function (obj) {
        let res = obj.response.res;
        obj.component.notifyService.show('Process Done');
    }).catch(function (err) {
        err.component.notifyService.show(err.err.json().err.message, 'warning');
    });
}
private randomColor() {
    return '#' + (function co(lor) {
        return (lor +=
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)])
            && (lor.length == 6) ? lor : co(lor);
    })('');
}
}
