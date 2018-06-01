import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { DynamicComponent } from '../../../common/dynamic-loader/dynamic-loader.model';
import { DynamicComponentNo1Component } from '../dynamic-component-no1/dynamic-component-no1.component';

@Component({
  selector: 'app-dynamic-component-no3',
  templateUrl: './dynamic-component-no3.component.html',
  styleUrls: ['./dynamic-component-no3.component.css']
})
export class DynamicComponentNo3Component implements OnInit, DynamicComponent {
  tabTitle = "Dynamic 3";
  tabEmitter: EventEmitter<any> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  
  openTab() {
    this.tabEmitter.emit({
      component: DynamicComponentNo1Component,
      data: {}
    });
  }

}
