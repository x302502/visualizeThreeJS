import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { DynamicComponent, DynamicTabItem } from '../../../common/dynamic-loader/dynamic-loader.model';
import { DynamicComponentNo2Component } from '../dynamic-component-no2/dynamic-component-no2.component';
import * as uuid from 'uuid';
import { DemoDynamicLoaderService } from '../demo-dynamic-loader.service';
@Component({
  selector: 'app-dynamic-component-no1',
  templateUrl: './dynamic-component-no1.component.html',
  styleUrls: ['./dynamic-component-no1.component.css']
})
export class DynamicComponentNo1Component implements OnInit, DynamicComponent {
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  users: any[] = [];
  constructor(private demoDynamicLoaderService: DemoDynamicLoaderService) { 
  }
  ngOnInit() {
    this.tabReload.subscribe(data=>{
      console.log(data);
    });

    this.demoDynamicLoaderService.getUsers().then((users:any[])=>{
      this.users = users;
    })
  }

  ngAfterViewInit(){

  }

  newUser(){
    let dynamicTabItem: DynamicTabItem = {
      id: uuid.v4(),
      title: 'User detail',
      component: DynamicComponentNo2Component,
      data: null
    }
    this.tabEmitter.emit(dynamicTabItem);
  }

  editUser(user){
    let dynamicTabItem: DynamicTabItem = {
      id: uuid.v4(),
      title: 'User detail',
      component: DynamicComponentNo2Component,
      data: user
    }
    this.tabEmitter.emit(dynamicTabItem);
  }
}
