import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { UtilityService } from '../../services/utility-service/utility.service';
import { DynamicTabItem, DynamicComponent } from '../../common/dynamic-loader/dynamic-loader.model';
@Component({
  selector: 'app-viewhelper-list',
  templateUrl: './viewhelper-list.component.html',
  styleUrls: ['./viewhelper-list.component.css']
})
export class ViewhelperListComponent implements DynamicComponent {
  //#region Dynamic Component
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  //#endregion
  data_helper = [];   selected_helper; total_helper = 0; currentPage_helper = 1; itemsPerPage_helper = 12;
  content_display: boolean = false;
  propertyName ; order = 'ASC';
  constructor(private route: ActivatedRoute,
    private router: Router,
    private appServices: AppServices,
    private notifyService: NotifyService,
    private utilityService: UtilityService) {
  }
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    let skip = (this.currentPage_helper -1)*this.itemsPerPage_helper ;
    let limit =  this.itemsPerPage_helper ;
    this.appServices.findHelp({ "filter": JSON.stringify({ "where": {'deleted': false}, "skip": skip, "limit": limit, 'order': this.propertyName ? this.propertyName + " " + this.order : null }) }, this)
    .then(function (__) {
      let json = __.response.json();
      __.component.data_helper = json.res;
      __.component.total_helper = json.total;
    }).catch(err=>{
      this.utilityService.handleError(err);
    })
  }
  selectHelper(helper) {
    this.selected_helper = Object.assign({}, helper);
    this.content_display = true;
  }
  goBack() {
    this.content_display = false;
  }
}
