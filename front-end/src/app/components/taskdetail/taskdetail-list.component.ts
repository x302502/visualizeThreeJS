import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import * as $ from 'jquery';
import 'bootstrap';
import { GridOption } from '../../common/grid-control/grid-control';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { SocketService, ISocketData } from '../../services/socket.service';

@Component({
  selector: 'taskdetail-list',
  templateUrl: './taskdetail-list.component.html',
})
export class TaskdetailListComponent implements OnInit, DynamicComponent {
  //#region Dynamic Component
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  //#endregion

  entity:any;
  prm;
  @ViewChild('grid') grid: GridControlComponent;
  gridOption: GridOption;

  // Subcription
  socketSubcription: any;
  constructor(private appServices: AppServices,
    private notifyService: NotifyService,
    private socketService: SocketService) {
      this.tabReload.subscribe(data => {
        this.entity = data;
        if(Object.keys(this.entity).length > 0)
        this.prm={'whseid': this.appServices.account.whseid,'sourcekey': this.entity.receiptkey,'storerkey':this.entity.storerkey};
      else this.prm={'whseid': this.appServices.account.whseid};
      });
  }

  ngOnInit() {
    this.socketSubcription = this.socketService.emitter.subscribe((socketData: ISocketData) => {
      if (socketData.code === "TASKDETAIL_CREATE" || socketData.code === "TASKDETAIL_UPDATE" || socketData.code === "TASKDETAIL_DELETE") {
        this.grid.reload();
      }
    });
    this.initGrid();
  }

  ngOnDestroy() {
    this.socketSubcription.unsubscribe()
  }

  initGrid() {
    this.gridOption = new GridOption();
    this.gridOption.component = this;
    this.gridOption.key = 'TaskdetailListComponent';
    this.gridOption.url = '/api/Taskdetails/find';
    this.gridOption.customFilter ={'whseid': this.appServices.account.whseid, 'sourcekey': this.entity.receiptkey, 'storerkey':this.entity.storerkey};
    this.gridOption.checkable = true;
    this.gridOption.commands = [];
    this.gridOption.columns = [{
      field: 'whseid',
      title: 'Whseid',
      type: 'string',
      width: '30px'
    },
    {
      field: 'storerkey',
      title: 'Owner',
      type: 'string',
      width: '30px'
    },
    {
      field: 'taskdetailkey',
      title: 'Task detail key',
      type: 'string',
      width: '30px'
    },
    {
      field: 'sourcekey',
      title: 'Receiptkey',
      type: 'string',
      width: '30px'
    },
    {
      field: 'sku',
      title: 'Item Code',
      type: 'string',
      width: '50px'
    },
    {
      field: 'lot',
      title: 'Lot',
      type: 'string',
      width: '30px'
    },
    {
      field: 'fromloc',
      title: 'From Location',
      type: 'string',
      width: '50px'
    },
    {
      field: 'fromid',
      title: 'From LPNID',
      type: 'string',
      width: '50px'
    },
    {
      field: 'toloc',
      title: 'To Location',
      type: 'string',
      width: '50px'
    },
    {
      field: 'lpnid',
      title: 'To LPNID',
      type: 'string',
      width: '50px'
    },
    {
      field: 'qty',
      title: 'Quantity',
      type: 'number',
      width: '20px'
    },
    {
      field: 'uom',
      title: 'Unit',
      type: 'string',
      width: '20px'
    },
    {
      field: 'status',
      title: 'Status',
      type: 'string',
      width: '20px'
    },
    {
      field: 'unitid',
      title: 'unitid',
      type: 'string',
      width: '20px'
    },
    {
      field: 'cartonid',
      title: 'cartonid',
      type: 'string',
      width: '20px'
    },
    {
      field: 'palletid',
      title: 'palletid',
      type: 'string',
      width: '20px'
    }
    ];
  }
  
}
