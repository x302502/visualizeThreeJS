import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicComponentNo1Component } from './dynamic-component-no1.component';

describe('DynamicComponentNo1Component', () => {
  let component: DynamicComponentNo1Component;
  let fixture: ComponentFixture<DynamicComponentNo1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicComponentNo1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicComponentNo1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
