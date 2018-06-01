import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';

@Component({
    selector: 'app-receipt-detail',
    templateUrl: './receipt-detail.component.html',
})
export class ReceiptDetailComponent implements DynamicComponent {

    tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
    tabReload: EventEmitter<any> = new EventEmitter();
}
