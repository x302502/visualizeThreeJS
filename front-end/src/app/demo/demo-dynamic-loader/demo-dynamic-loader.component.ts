import { Component, OnInit, Input, EventEmitter, QueryList, ViewChildren, ComponentFactoryResolver, forwardRef, Type, ElementRef } from '@angular/core';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
import { DynamicComponentNo1Component } from './dynamic-component-no1/dynamic-component-no1.component';
import { DynamicLoaderDirective } from '../../common/dynamic-loader/dynamic-loader.directive';
import * as uuid from 'uuid';
import { DynamicComponentNo2Component } from './dynamic-component-no2/dynamic-component-no2.component';
import { DynamicComponentNo3Component } from './dynamic-component-no3/dynamic-component-no3.component';
import * as $ from 'jquery';
import 'bootstrap';
@Component({
  selector: 'app-demo-dynamic-loader',
  templateUrl: './demo-dynamic-loader.component.html',
  styleUrls: ['./demo-dynamic-loader.component.css']
})
export class DemoDynamicLoaderComponent implements OnInit {
  menu = {
    dynamicComponentNo1: {
        title: 'User list',
        component: DynamicComponentNo1Component
    }, 
    dynamicComponentNo2: {
        title: 'User detail',
        component: DynamicComponentNo2Component
    },
    dynamicComponentNo3: {
        title: 'Dynamic 3',
        component: DynamicComponentNo3Component
    }
  };
  tabs: DynamicTabItem[] = [];
  changeType: 'add'|'remove';
  dynamicComponents: DynamicComponent[] = [];
  @ViewChildren(DynamicLoaderDirective) private dynamicLoaders: QueryList<DynamicLoaderDirective>;
  @ViewChildren('tabElement') private tabElements: QueryList<ElementRef>;
  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    // subcribe khi có sự thay đổi tab
    this.dynamicLoaders.changes.subscribe((dynamicLoaders) => {
      // nếu là thêm tab mới
      if (this.changeType === 'add') {
        let idx = this.tabs.length - 1;
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.tabs[idx].component);
        let viewContainerRef = this.dynamicLoaders.find((dynamicLoader, index) => index == idx).viewContainerRef;
        viewContainerRef.clear();
        setTimeout(() => {
          let componentRef = viewContainerRef.createComponent(componentFactory);
          let dynamicComponent = (<DynamicComponent>componentRef.instance);
          dynamicComponent.tabReload.emit(this.tabs[idx].data);
          this.dynamicComponents.push(dynamicComponent);
          let subcription = (<DynamicComponent>componentRef.instance).tabEmitter.subscribe((dynamicTabItem: DynamicTabItem) => {
            this.openTab(dynamicTabItem);
          });
        }, 0);
      }
    });

    this.tabElements.changes.subscribe(()=>{
      if(this.changeType === 'add'){
        $(this.tabElements.toArray()[this.tabElements.length - 1].nativeElement).tab('show');
      } else if(this.changeType === 'remove'){
        if(this.tabElements.length){
          $(this.tabElements.toArray()[this.tabElements.length - 1].nativeElement).tab('show');
        }
      }
    });
  }
  openTab(dynamicTabItem: DynamicTabItem) {
    // kiểm tra đã có tab nào load component đó chưa
    let idx = this.tabs.findIndex(tab => tab.component == dynamicTabItem.component);
    if (idx < 0) {
      this.changeType = 'add';
      this.tabs.push({
        id: uuid.v4(),
        title: dynamicTabItem.title,
        component: dynamicTabItem.component,
        data: dynamicTabItem.data
      });
    } else {
      // ngoài ra, emit data mới vào tabReload
      this.dynamicComponents[idx].tabReload.emit(dynamicTabItem.data);
      $(this.tabElements.toArray()[idx].nativeElement).tab('show');
    }
  }
  closeTab(tab: DynamicTabItem) {
    this.changeType = 'remove';
    let index = this.tabs.indexOf(tab);
    this.tabs.splice(index, 1);
    this.dynamicComponents.splice(index,1);
  }
}
