import { Component, OnInit, ViewChild, ElementRef, NgZone, EventEmitter } from '@angular/core';
import { NewwarehouseService } from '../../services/three-service';
import { Dock } from '../../common/models';
import '../../common/models/extension';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { DataThreeService } from '../../services/three-service/data-three.service';
import { NotifyService } from '../../notify.service';
import { Response } from '@angular/http';
@Component({
  selector: 'app-newwarehouse',
  templateUrl: './newwarehouse.component.html',
  styleUrls: ['./newwarehouse.component.css'],
  providers: [
    NewwarehouseService,
    DataThreeService
  ]
})
export class NewwarehouseComponent implements OnInit, DynamicComponent {
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  @ViewChild('warehouse') warehouse: ElementRef;
  private token: string = '';
  private stop;
  private listDock: Dock[] = [];
  private usename: string = 'smartlog';
	private password: string = 'rtls130nmh';
  constructor(private newwarehouseService: NewwarehouseService, 
    private ngZone: NgZone,
    private dataThreeService: DataThreeService,
    private notifyService:NotifyService) {
  }

  ngOnInit() {
    this.newwarehouseService.container = this.warehouse.nativeElement
    this.newwarehouseService.setSize();
    this.loadToken();
  }
  ngAfterViewInit() {
    this.newwarehouseService.makeScene(200000, 200000);
    this.newwarehouseService.makeLocationAxis();
    this.newwarehouseService.makeBackground(121380, 109000, 'white');
    this.newwarehouseService.makeBacgroundWareHouse(100000, 100000, 0xACAEAD, 8400 + 21980, 0);
    this.newwarehouseService.makeBacgroundWareHouse(50000, 100000, 0xACAEAD, -50000, 0);
    this.listDock = this.createListDock();
    this.newwarehouseService.makeListDock(this.listDock);
    this.newwarehouseService.makeTruck(200, 'delivery', -30000, 0, 15000);
    this.newwarehouseService.makeTruck(201, 'container', -40000, 0, 1000);
    this.newwarehouseService.makeTruck(202, 'delivery', -40000, 0, 20000);
    this.ngZone.runOutsideAngular(() => this.newwarehouseService.animated())
  }
  loadToken() {
    this.dataThreeService.getToken(this.usename,this.password)
    .then( data => {
      console.log(data)
      let tempData = this.parseJson(data);
      if(!tempData) {
        this.notifyService.error('Err load token');
      }
      this.token = tempData.token;
      console.log(this.token)
    }).catch( _ => this.notifyService.error('Err load token'))
  }
  parseJson(res: Response){
    try {
      res.json()
    } catch (error) {
      return undefined
    }
    return  res.json();
  }
  runTruck() {
    this.stop = this.newwarehouseService.runTruck(this.listDock);
    this.ngZone.runOutsideAngular(() => this.newwarehouseService.animated())
  }
  stopTruck() {
    clearInterval(this.stop);
  }
  createListDock() {
    let listDock: Dock[] = [];
    listDock.push(new Dock('D1', 21980, 9000, 8400, 6500, 0x2D7A74))
    for (let i = 2; i <= 10; i++) {
      let color = (i % 2) ? 0x2D7A74 : 0x156A91
      let dock = listDock[listDock.length - 1];
      let marginX = dock.marginX;
      let marginZ = dock.sizeZ + dock.marginZ;
      if (i === 5 || i === 6) {
        listDock.push(new Dock(`D${i}`, 21980, 8000, marginX, marginZ, color));
      } else {
        listDock.push(new Dock(`D${i}`, 21980, 9000, marginX, marginZ, color));
      }
    }
    return listDock;
  }
  ngOnDestroy() {
    this.stopTruck();
    cancelAnimationFrame(this.newwarehouseService.idRenderer)
  }
}
