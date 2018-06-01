import { Component, OnInit, ViewChild, ElementRef, NgZone, EventEmitter, HostListener } from '@angular/core';
import * as $ from 'jquery';
import * as uuid from 'uuid'
import 'bootstrap';
import { VisualizeService } from '../../services/three-service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { ApiVisualizeService } from '../../services/three-service/api-visualize.service';
import { NotifyService } from '../../notify.service';
import { PoupVisualizeComponent } from './poup-visualize/poup-visualize.component';
import { DataModal, InputModal, MyLocation } from '../../common/models';
declare var Detector: any;

const DATAFORM = [
    {
        type: 'background', title: 'Make background', listInput: [
            { title: 'width (X)', type: 'number', name: 'sizeX', value: '' },
            { title: 'depth (Z)', type: 'number', name: 'sizeZ', value: '' },
            { title: 'Color ', type: 'text', name: 'color', value: '' }
        ]
    },
    {
        type: 'rack', title: 'Make rack', listInput: [
            { title: 'Quantity row (X)', type: 'number', name: 'qtyRow', value: '' },        
            { title: 'Quantity height  (Y)', type: 'number', name: 'qtyHeight', value: '' },
            { title: 'Quantity column (Z)', type: 'number', name: 'qtyColumn', value: '' },
            { title: 'Width box  (x)', type: 'number', name: 'sizeX', value: '' },
            { title: 'Height box  (y)', type: 'number', name: 'sizeY', value: '' },
            { title: 'Depth box  (z)', type: 'number', name: 'sizeZ', value: '' },
            { title: 'Color ', type: 'text', name: 'color', value: '' },
        ]
    }
]

@Component({
    selector: 'app-visualize',
    templateUrl: './visualize.component.html',
    styleUrls: ['./visualize.component.css'],
    providers: [
        VisualizeService,
        ApiVisualizeService,
        PoupVisualizeComponent
    ]
})
export class VisualizeComponent implements OnInit, DynamicComponent {
    tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
    tabReload: EventEmitter<any> = new EventEmitter();
    @ViewChild('visualizeContainer') visualizeContainer: ElementRef;
    public isLoading = false;
    private timeLoading: number;
    public modalId = uuid.v4();
    public dataModal: DataModal = new DataModal();
    constructor(private visualizeService: VisualizeService,
        private ngZone: NgZone,
        private apiVisualizeService: ApiVisualizeService,
        private poupVisualize: PoupVisualizeComponent,
        private notifyService: NotifyService) {

    }

    ngOnInit() {
        this.visualizeService.container = this.visualizeContainer.nativeElement
        this.loadData();
        this.poupVisualize.modalId = this.modalId;
    }

    ngAfterViewInit() {
        this.visualizeService.setSize();
        this.visualizeService.makeScene();
        this.visualizeService.makeLocationAxis(10000);
        this.ngZone.runOutsideAngular(() => this.visualizeService.animated());
    }
    ngOnDestroy() {
        cancelAnimationFrame(this.visualizeService.idRenderer)
    }
    loadData() {
        this.isLoading = true;
        this.timeLoading = Date.now();
        this.apiVisualizeService.loadLocList().then(res => {
            console.log(res);
            this.isLoading = false;
            this.timeLoading = Date.now() - this.timeLoading;
            console.log(this.timeLoading)
        }).catch(err => {
            this.notifyService.error('No loaded data');
            this.isLoading = false;
            this.timeLoading = Date.now() - this.timeLoading;
            console.log(this.timeLoading)
        })
    }
    
    open(data) {
        this.dataModal = DATAFORM.find(x => x.type === data);
        this.poupVisualize.open();
    }
    createBackground(listInput: InputModal[]) {
        let sizeX = Number(listInput.find(x => x.name === 'sizeX').value) *1000;
        let sizeZ = Number(listInput.find(x => x.name === 'sizeZ').value) *1000;
        let color = listInput.find(x => x.name === 'color').value || 0xA9A9A9;
        this.visualizeService.createBackgroudWareHouse(sizeX,sizeZ,color);
        this.visualizeService.setControlsAndCamera(sizeX,sizeZ);
    }
    createRack(listInput: InputModal[]){
        let qtyRow = Number(listInput.find(x => x.name === 'qtyRow').value);
        let qtyHeight = Number(listInput.find(x => x.name === 'qtyHeight').value);
        let qtyColumn = Number(listInput.find(x => x.name === 'qtyColumn').value);
        let sizeX = Number(listInput.find(x => x.name === 'sizeX').value) *1000;
        let sizeY = Number(listInput.find(x => x.name === 'sizeY').value) *1000;
        let sizeZ = Number(listInput.find(x => x.name === 'sizeZ').value) *1000;
        let color = listInput.find(x => x.name === 'color').value || 'blue';
        this.visualizeService.makeRack(new MyLocation(sizeX,sizeY,sizeZ),qtyRow,qtyHeight,qtyColumn,color);
    }   
    cloneData(data: DataModal) {
        switch (data.type) {
            case 'background':
                this.visualizeService.removeChildren(data.type);
                this.visualizeService.keyTask = data.type
                this.createBackground(data.listInput);
                break;
            case 'rack':
                // this.createRack(data.listInput);
                this.visualizeService.keyTask = data.type
                this.createRack(data.listInput);
                break;
            
            default:
                break;
        }
    }
}

