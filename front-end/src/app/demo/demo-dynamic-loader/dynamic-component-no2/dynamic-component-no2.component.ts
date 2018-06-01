import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { DynamicComponent, DynamicTabItem } from '../../../common/dynamic-loader/dynamic-loader.model';
import { DynamicComponentNo3Component } from '../dynamic-component-no3/dynamic-component-no3.component';
import { DemoDynamicLoaderService } from '../demo-dynamic-loader.service';
import { DynamicComponentNo1Component } from '../dynamic-component-no1/dynamic-component-no1.component';
import * as uuid from 'uuid';

@Component({
  selector: 'app-dynamic-component-no2',
  templateUrl: './dynamic-component-no2.component.html',
  styleUrls: ['./dynamic-component-no2.component.css']
})
export class DynamicComponentNo2Component implements OnInit, DynamicComponent {
  tabEmitter: EventEmitter<any> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  user: any = {};
  @Input() tabData: any;
  constructor(private demoDynamicLoaderService: DemoDynamicLoaderService) {
    this.tabReload.subscribe(user => {
      if (user) this.user = user;
      else this.user = {};
    });
  }

  ngOnInit() {

  }
  save() {
    this.demoDynamicLoaderService.saveUser(this.user).then(user => {
      this.user = user;

      let dynamicTabItem: DynamicTabItem = {
        id: uuid.v4(),
        title: 'User list',
        component: DynamicComponentNo1Component,
        data: null
      }
      this.tabEmitter.emit(dynamicTabItem);
    });
  }
}
