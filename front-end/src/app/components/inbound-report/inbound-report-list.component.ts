import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { NotifyService } from './../../notify.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { GridOption } from '../../common/grid-control/grid-control';
import { AuthService } from '../../services/auth-service/auth.service';
import { API } from '../../services/api-service/api.resource';

@Component({
  selector: 'app-inbound-report-list',
  templateUrl: './inbound-report-list.component.html',
  styleUrls: ['./inbound-report-list.component.css']
})
export class InboundReportListComponent implements DynamicComponent {
  tabEmitter: EventEmitter<DynamicTabItem>;
  @ViewChild('grid') grid: GridControlComponent;
  gridOption: GridOption = new GridOption();
  constructor(private authService: AuthService,
    private notifyService: NotifyService
  ) {
  }
  ngOnInit() {
    this.initGrid();
  }
  initGrid() {
    this.gridOption = new GridOption();
    this.gridOption.component = this;
    this.gridOption.key = 'InboundReportListComponent';
    this.gridOption.url = API.INBOUND_REPORT.GET_LIST;
    this.gridOption.type = 'custom';
    this.gridOption.customFilter = `deleted = false AND WHSEID = '${this.authService.user.whseid}' AND STORERKEY IN (${this.authService.user.strOwners})`;
    this.gridOption.columns = [{
      field: 'whseid',
      title: 'WHSEID',
      type: 'string',
      width: '120px'
    }, {
      field: 'receiptkey',
      title: 'RECEIPT KEY',
      type: 'string',
      width: '120px'
    }, {
      field: 'storerkey',
      title: 'Owner',
      type: 'string',
      width: '120px'
    }, {
      field: 'externreceiptkey',
      title: 'PO',
      type: 'string',
      width: '120px'
    }, {
      field: 'sku',
      title: 'ITEM CODE',
      type: 'string',
      width: '120px'
    }, {
      field: 'uom',
      title: 'UOM',
      type: 'string',
      width: '120px'
    }, {
      field: 'qtyexpected',
      title: 'QTY EXPECTED',
      type: 'number',
      width: '120px'
    }, {
      field: 'qtyreceived',
      title: 'QTY RECEIVED',
      type: 'number',
      width: '120px'
    }, {
      field: 'netwgt',
      title: 'NETWGT',
      type: 'number',
      width: '120px'
    }, {
      field: 'palletid',
      title: 'PALLET ID',
      type: 'string',
      width: '120px'
    }, {
      field: 'status',
      title: 'STATUS',
      type: 'values',
      values: [
        {
          value: '0',
          text: 'New',
          backgroundColor: '#757575'
        },
        {
          value: '5',
          text: 'In Receiving',
          backgroundColor: '#536DFE'
        },
        {
          value: '9',
          text: 'Received',
          backgroundColor: '#009688'
        }
      ],
      width: '120px'
    }, {
      field: 'receiptdate',
      title: 'RECEIPT DATE',
      type: 'date',
      width: '120px'
    }];
  }
}
