import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicComponentNo3Component } from './dynamic-component-no3.component';

describe('DynamicComponentNo3Component', () => {
  let component: DynamicComponentNo3Component;
  let fixture: ComponentFixture<DynamicComponentNo3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicComponentNo3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicComponentNo3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
