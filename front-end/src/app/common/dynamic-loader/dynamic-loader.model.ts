import { Type, EventEmitter } from '@angular/core';

export interface DynamicTabItem {
  id?: string; // tab id
  title?: string; // tab title
  component: Type<DynamicComponent>; // tab component
  data?: any; // data for component
}

export interface DynamicComponent {
  tabEmitter?: EventEmitter<DynamicTabItem>;
  tabReload?: EventEmitter<any>;
}