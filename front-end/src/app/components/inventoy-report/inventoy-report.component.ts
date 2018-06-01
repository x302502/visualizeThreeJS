import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';

import { NotifyService } from './../../notify.service';


import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { DecimalPipe } from '@angular/common';
import { GridOption } from '../../common/grid-control/grid-control';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { AuthService } from '../../services/auth-service/auth.service';
import { API } from '../../services/api-service/api.resource';

@Component({
    selector: 'app-inventoy-report',
    templateUrl: './inventoy-report.component.html',
    styleUrls: ['./inventoy-report.component.css']
})
export class InventoyReportComponent implements DynamicComponent {
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
        this.gridOption.key = 'InventoryReportComponent';
        this.gridOption.url = API.INVENTORY.LIST_REPORT;
        this.gridOption.type = 'custom';
        this.gridOption.checkable = true;
        this.gridOption.customFilter = `WHSEID = '${this.authService.user.whseid}' AND STORERKEY IN (${this.authService.user.strOwners})`;
        this.gridOption.columns = [{
            field: 'storerkey',
            title: 'STORERKEY',
            type: 'string',
            width: '120px'
        }, {
            field: 'receiptkey',
            title: 'RECEIPTKEY',
            type: 'string',
            width: '120px'
        }, {
            field: 'externreceiptkey',
            title: 'PO',
            type: 'string',
            width: '120px'
        }, {
            field: 'sku',
            title: 'SKU',
            type: 'string',
            width: '120px'
        }, {
            field: 'location',
            title: 'LOC',
            type: 'string',
            width: '120px'
        }, {
            field: 'lottable05',
            title: 'EXPIRED DATE',
            type: 'date',
            width: '120px'
        }, {
            field: 'lot',
            title: 'LOT',
            type: 'string',
            width: '120px'
        }, {
            field: 'qty_unit',
            title: 'QTY PCS',
            type: 'number',
            width: '120px'
        }, {
            field: 'qty_case',
            title: 'ON HAND (case)',
            type: 'number',
            width: '120px'
        }, {
            field: 'qty_piece',
            title: 'ON HAND (piece)',
            type: 'number',
            width: '120px'
        }, {
            field: 'lottable01',
            title: 'BATCH/NO',
            type: 'number',
            width: '120px'
        }, {
            field: 'lottable04',
            title: 'MANUFACTURED DATE',
            type: 'date',
            width: '120px'
        }, {
            field: 'palletid',
            title: 'PALLETID',
            type: 'string',
            width: '120px'
        }];
    }
}
