import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import * as $ from 'jquery';
import 'bootstrap';
import { SocketService, ISocketData } from '../../services/socket.service';
import { GridOption } from '../../common/grid-control/grid-control';
import { GridControlComponent } from '../../common/grid-control/grid-control.component';
import { DynamicTabItem, DynamicComponent } from '../../common/dynamic-loader/dynamic-loader.model';
import { HelperDetailComponent } from './helper-detail.component';
import { UtilityService } from '../../services/utility-service/utility.service';

@Component({
  selector: 'app-helper-list',
  templateUrl: './helper-list.component.html'
})
export class HelperListComponent implements OnInit, DynamicComponent {
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();

  @ViewChild('grid') grid: GridControlComponent;
  gridOption: GridOption;

  socketSubcription: any;
  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private appServices: AppServices, 
    private notifyService: NotifyService,
    private socketService: SocketService,
    private utilityService: UtilityService) {
  }

  ngOnInit() {
    this.listenSocket();
    this.initGrid();
  }

  ngOnDestroy() {
    if (this.socketSubcription) this.socketSubcription.unsubscribe();
  }

  listenSocket() {
    this.socketSubcription = this.socketService.emitter.subscribe((socketData: ISocketData) => {
      if (socketData.code === "HELPER_CREATE" || socketData.code === "HELPER_UPDATE" || socketData.code === "HELPER_DELETE") {
        this.grid.reload();
      }
    });
  }

  initGrid() {
    this.gridOption = new GridOption();
    this.gridOption.component = this;
    this.gridOption.key = 'HelperListComponent';
    this.gridOption.url = '/api/Help/findHelp';
    this.gridOption.customFilter = {
      'deleted': false
    };
    this.gridOption.commands = [{
      icon: 'fa fa-edit text-primary',
      click: this.detail
    }, {
      icon: 'fa fa-trash text-danger',
      click: this.delete
    }];
    this.gridOption.columns = [{
      field: 'name',
      title: 'Name',
      type: 'string',
      width: '200px'
    }, {
      field: 'title',
      title: 'Title',
      type: 'string'
    }];
  }

  detail = (data?: any) => {
    let dynamicTabItem: DynamicTabItem = {
      title: 'Helper Detail',
      component: HelperDetailComponent,
      data: data
    }
    this.tabEmitter.emit(dynamicTabItem);
  }

  delete(data) {
    this.notifyService.confirmDelete().then(() => {
      data['deleted'] = true;
      data['currentuser'] = this.appServices.account.username;
      this.appServices.updateHelp({ 'obj': JSON.stringify(data) }, this).then((__) => {
        this.notifyService.success('Process Done');
        this.socketService.send({
          code: "HELPER_DELETE",
          data: null
        });
        this.grid.reload();
      }).catch((err) => {
        this.utilityService.handleError(err);
      })
    });
  }
}
