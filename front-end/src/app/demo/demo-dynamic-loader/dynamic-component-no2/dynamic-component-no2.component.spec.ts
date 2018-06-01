import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicComponentNo2Component } from './dynamic-component-no2.component';

describe('DynamicComponentNo2Component', () => {
  let component: DynamicComponentNo2Component;
  let fixture: ComponentFixture<DynamicComponentNo2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicComponentNo2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicComponentNo2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
