import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { NotifyService } from './../../notify.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { GridOption } from '../../common/grid-control/grid-control';
import { AuthService } from '../../services/auth-service/auth.service';
import { API } from '../../services/api-service/api.resource';

@Component({
    selector: 'app-inventory-list',
    templateUrl: './inventory-list.component.html',
    styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit, DynamicComponent {
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
        let listowner = this.authService.user.strOwners
        this.gridOption = new GridOption();
        this.gridOption.component = this;
        this.gridOption.key = 'InventoryListComponent';
        this.gridOption.url = API.INVENTORY.GET_LIST;
        this.gridOption.type = 'custom';
        this.gridOption.checkable = true;
        this.gridOption.customFilter = `WHSEID = '${this.authService.user.whseid}' AND STORERKEY IN (${listowner})`;
        this.gridOption.columns = [{
            field: 'STORERKEY',
            title: 'STORERKEY',
            type: 'string',
            width: '120px'
        }, {
            field: 'EXTERNRECEIPTKEY',
            title: 'PO',
            type: 'string',
            width: '120px'
        }, {
            field: 'SKU',
            title: 'SKU',
            type: 'string',
            width: '120px'
        }, {
            field: 'LOT',
            title: 'LOT',
            type: 'string',
            width: '120px'
        }, {
            field: 'LOC',
            title: 'LOC',
            type: 'string',
            width: '120px'
        }, {
            field: 'QTY',
            title: 'QTY',
            type: 'number',
            width: '120px'
        }, {
            field: 'PACKUOM3',
            title: 'PACKUOM3',
            type: 'string',
            width: '120px'
        }, {
            field: 'OnHand_Case',
            title: 'OnHand_Case',
            type: 'number',
            width: '120px'
        }, {
            field: 'OnHand_PCS',
            title: 'OnHand_PCS',
            type: 'string',
            width: '120px'
        }, {
            field: 'QTYALLOCATED',
            title: 'QTYALLOCATED',
            type: 'number',
            width: '120px'
        }, {
            field: 'QTYPICKED',
            title: 'QTYPICKED',
            type: 'number',
            width: '120px'
        }, {
            field: 'QTYAVAILABLE',
            title: 'QTYAVAILABLE',
            type: 'number',
            width: '120px'
        }, {
            field: 'STATUS',
            title: 'STATUS',
            type: 'string',
            width: '120px'
        }, {
            field: 'LPNID',
            title: 'LPNID',
            type: 'string',
            width: '120px'
        }, {
            field: 'LOTTABLE01',
            title: 'LOTTABLE01',
            type: 'string',
            width: '120px'
        }, {
            field: 'LOTTABLE02',
            title: 'LOTTABLE02',
            type: 'string',
            width: '120px'
        }, {
            field: 'LOTTABLE03',
            title: 'LOTTABLE03',
            type: 'string',
            width: '120px'
        }, {
            field: 'LOTTABLE04',
            title: 'LOTTABLE04',
            type: 'date',
            width: '120px'
        }, {
            field: 'LOTTABLE05',
            title: 'LOTTABLE05',
            type: 'date',
            width: '120px'
        }, {
            field: 'DAYOFF',
            title: 'DAYOFF',
            type: 'number',
            width: '120px'
        }, {
            field: 'LOTTABLE06',
            title: 'LOTTABLE06',
            type: 'string',
            width: '120px'
        }, {
            field: 'LOTTABLE07',
            title: 'LOTTABLE07',
            type: 'string',
            width: '120px'
        }, {
            field: 'LOTTABLE08',
            title: 'LOTTABLE08',
            type: 'string',
            width: '120px'
        }, {
            field: 'LOTTABLE09',
            title: 'LOTTABLE09',
            type: 'string',
            width: '120px'
        }, {
            field: 'LOTTABLE10',
            title: 'LOTTABLE10',
            type: 'string',
            width: '120px'
        }, {
            field: 'LOTTABLE11',
            title: 'LOTTABLE11',
            type: 'date',
            width: '120px'
        }, {
            field: 'LOTTABLE12',
            title: 'LOTTABLE12',
            type: 'date',
            width: '120px'
        }, {
            field: 'UNITID',
            title: 'UNITID',
            type: 'string',
            width: '120px'
        }, {
            field: 'CARTONID',
            title: 'CARTONID',
            type: 'string',
            width: '120px'
        }, {
            field: 'PALLETID',
            title: 'PALLETID',
            type: 'string',
            width: '120px'
        }];
    }

    summarization = {
        skuCount: 0,
        qtyTotal: 0
    };
    summarize(data) {
        let items = data.res as any[];
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        this.summarization = {
            skuCount: items.map(item => item.SKU).filter(onlyUnique).length,
            qtyTotal: items.map(item => +item.QTY).reduce((a, b) => a + b)
        }
    }
}