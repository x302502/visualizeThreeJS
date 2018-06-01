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
import 'jquery';
import { debug } from 'util';
import { element } from 'protractor';
import 'bootstrap';
import { PopupAsnComponent } from '../../common/popup-asn/popup-asn.component';
import { SocketService, ISocketData } from '../../services/socket.service';
import { NotifyService } from '../../notify.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { DynamicTabItem, DynamicComponent } from '../../common/dynamic-loader/dynamic-loader.model';

@Component({
    selector: 'app-dock-asn',
    templateUrl: './dock-asn.component.html',
    styleUrls: ['./dock-asn.component.css']
})
export class DockAsnComponent implements DynamicComponent {
    //#region Dynamic Component
    tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
    tabReload: EventEmitter<any> = new EventEmitter();
    //#endregion
    dataReceipt; filter; dataDock = []; dataDockShow = []; dataShipment; dataShipment_no_beginTime = []; dataShipment_show = [];
    @ViewChild('scheduleControl') schedule: ScheduleControlComponent;
    @ViewChild('popupASN') popupASN: PopupAsnComponent;
    constructor(private appServices: AppServices,
        private router: Router,
        private socketService: SocketService,
        private notifyService: NotifyService,
        private datePipe: DatePipe
    ) {
        this.socketService.emitter.subscribe((socketData: ISocketData) => {
            if (socketData.code === "DOCK_ASN_CREATE") {
                // console.log(socketData.data);

                let receipt = socketData.data;
                this.schedule.renderEvent({
                    id: uuid(),
                    title: receipt.receiptkey,
                    start: receipt.begintime,
                    end: receipt.endtime,
                    backgroundColor: this.randomColor()
                });
                this.removeData(receipt);
            } else if (socketData.code === "DOCK_ASN_UPDATE") {
                socketData.data;
            }
        });
    }
    ngOnInit() {
        this.loadReceiptData();
    }
    loadReceiptData(param?: Object) {
        let filter;
        this.appServices.listReceiptForDock({
            'filter': JSON.stringify(filter),
            'obj': JSON.stringify({ 'whseid': this.appServices.account.whseid, 'deleted': false, 'listStorerkey': this.appServices.account.strOwners })
        }, this).then(obj => {
            this.dataReceipt = obj.response.json().res;
            this.dataReceipt.forEach(element => {
                if (element.begintime == null && element.status == 0) {
                    this.dataDock.push(element);
                    // console.log(this.dataDock);
                } else {
                    element.begintime = moment(element.begintime).toDate();
                    element.endtime = moment(element.endtime).toDate();
                    this.dataDockShow.push(element);
                    // console.log(this.dataDockShow);
                }
            });
            this.loadDataDock();
        });
    }
   
    ngAfterViewInit() {
        // this.schedule.draw(option);
    }

    loadDataDock() {
        let options = new ScheduleOption();
        // 
        this.dataDockShow.forEach(element => {
            if (element.begintime) {
                options.events.push({
                    id: element.receiptkey,
                    start: element.begintime,
                    end: element.endtime,
                    title: element.receiptkey,
                    backgroundColor: '#74a4f2',
                    color: '#FFF',
                    tooltipItems: [
                        {
                            title: 'P/O No',
                            value: element.externreceiptkey
                        },
                       ,
                        {
                            title: 'Company',
                            value: element.storerkey
                        },
                        {
                            title: 'Supplier',
                            value: element.suppliername,
                        }
                    ]
                });

            }
        });
        
        this.schedule.draw(options);
    }
  

    // addExternalEvent() {
    //     let externalEvent = {
    //         title: this.dataReceipt[0].receiptkey,
    //         data: {},
    //     };
    //     this.schedule.externalEvent.add(externalEvent);
    // }
    addExternalEvents() {
        // let externalEvents = [{
        //     title: uuid(),
        //     data: {}
        // },
        // {
        //     title: uuid(),
        //     data: {}
        // },
        // {
        //     title: uuid(),
        //     data: {}
        // }];
        // this.schedule.externalEvent.add(externalEvents);
        this.schedule.externalEvent.clear();
        let externalEvents = [];
        this.dataDock.forEach(element => {
            externalEvents.push({
                title: element.receiptkey,
                data: element
            });
        })
        this.schedule.externalEvent.add(externalEvents);
    }
  

    click(date: Date) {
        this.popupASN.openCreate(date);
    }
    removeData(item) {
        let index = this.dataDock.map(function (e) {
            return e.receiptkey
        }).indexOf(item.receiptkey);
        this.dataDock.splice(index, 1);
        // this.schedule.externalEvent.remove(index);
        this.addExternalEvents();
        // this.schedule.externalEvent.splice(externalEvents);
    }

    drop(event) {
        // event.date
        // event.data

        // let data = {};
        // event.data['begintime'] = event.date;
        // event.data['endtime'] = next;
        console.log(event);

        var adddate = new Date();
        var n = adddate.getTimezoneOffset() / -60;
        let next = new Date(event.date);
        next.setHours(next.getHours() + 1);

        event.data['begintime'] = moment(event.date).add(n, 'h').toDate();
        event.data['endtime'] = moment(next).add(n, 'h').toDate();
        event.data['username'] = this.appServices.account.username;

        //update time for Receipt table when drop 
        if (event.data.receiptkey) {
            this.appServices.updateTimeReceiptForDock({ 'obj': JSON.stringify(event.data) }, this).then(() => {
                this.socketService.send({
                    code: 'DOCK_ASN_CREATE',
                    data: event.data
                });
                this.notifyService.show('Process Done');
            }).catch(function (err) {
                err.component.notifyService.show(err.err.json().err.message, 'warning');
            });
        }
        // } else {
        //     console.log('noooooo');
        //     //update time for Order table when drop

        //     this.appServices.updateTimeOrderForDock({ 'obj': JSON.stringify(event.data) }, this).then(() => {
        //         this.socketService.send({
        //             code: 'DOCK_ASN_CREATE',
        //             data: event.data
        //         });
        //         this.notifyService.show('Process Done');
        //     }).catch(function (err) {
        //         err.component.notifyService.show(err.err.json().err.message, 'warning');
        //     });

        // }
    }

    clickEvent(event: EventObjectInput) {
    }
    updateEvent(event: EventObjectInput) {
        var adddate = new Date();
        var n = adddate.getTimezoneOffset() / -60;
        // event['begintime'] = event.start;
        event['begintime'] = moment(event.start).add(n, 'h').toDate();
        // event['endtime'] = event.end;
        event['endtime'] = moment(event.end).add(n, 'h').toDate();
        event['whseid'] = this.appServices.account.whseid;
        event['receiptkey'] = event.title;
        console.log(event);
        this.appServices.updateTimeReceiptForDock({ 'obj': JSON.stringify(event) }, this).then(function (obj) {
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
