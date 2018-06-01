import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { ModalComponent } from '../../common/modal.component';
import { CompleterService, CompleterData } from 'ng2-completer';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';

import * as $ from 'jquery';
import 'bootstrap';
import { CheckInListComponent } from './check-in-list.component';
import { SocketService } from '../../services/socket.service';
@Component({
    selector: 'app-check-in-detail',
    templateUrl: './check-in-detail.component.html'
})
export class CheckinDetailComponent implements OnInit, DynamicComponent {
    tabEmitter?: EventEmitter<DynamicTabItem>;
    tabReload?: EventEmitter<any>;
    constructor(private router: Router,
        private appServices: AppServices,
        private notifyService: NotifyService,
        private completerService: CompleterService,
        private socketService: SocketService) {
        // this.tabReload.subscribe(data => {
        //   this.entity = data;
        //   if(Object.keys(this.entity).length > 0)this.loadShipCodeData();
        //   else this.data_shipcode=[];
        // });
      }
      ngOnInit() {
        // this.loadCustomerGroupData();
      }
}