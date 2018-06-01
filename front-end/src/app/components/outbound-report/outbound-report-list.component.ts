import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { NotifyService } from './../../notify.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { GridOption } from '../../common/grid-control/grid-control';
import { AuthService } from '../../services/auth-service/auth.service';
import { API } from '../../services/api-service/api.resource';
@Component({
  selector: 'app-outbound-report-list',
  templateUrl: './outbound-report-list.component.html',
  styleUrls: ['./outbound-report-list.component.css']
})
export class OutboundReportListComponent implements DynamicComponent {
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
    this.gridOption.key = 'OutboundReportListComponent';
    this.gridOption.url = API.OUTBOUND_REPORT.GET_LIST;
    this.gridOption.type = 'custom';
    this.gridOption.customFilter = `deleted = false AND WHSEID = '${this.authService.user.whseid}' AND STORERKEY IN (${this.authService.user.strOwners})`;
    this.gridOption.columns = [{
      field: 'whseid',
      title: 'WHSEID',
      type: 'string',
      width: '120px'
    }, {
      field: 'orderkey',
      title: 'ORDER KEY',
      type: 'string',
      width: '120px'
    }, {
      field: 'storerkey',
      title: 'Owner',
      type: 'string',
      width: '120px'
    }, {
      field: 'description',
      title: 'TYPE',
      type: 'string',
      width: '120px'
    }, {
      field: 'externorderkey',
      title: 'SO',
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
      field: 'qtyopen',
      title: 'QTY OPEN',
      type: 'number',
      width: '120px'
    }, {
      field: 'qtyallocated',
      title: 'QTY ALLOCATED',
      type: 'number',
      width: '120px'
    }, {
      field: 'qtypicked',
      title: 'QTY PICKED',
      type: 'number',
      width: '120px'
    }, {
      field: 'qtyshipped',
      title: 'QTY SHIPPED',
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
      type: 'string',
      width: '120px'
    }, {
      field: 'orderdate',
      title: 'ORDER DATE',
      type: 'date',
      width: '120px'
    }];
  }
}
