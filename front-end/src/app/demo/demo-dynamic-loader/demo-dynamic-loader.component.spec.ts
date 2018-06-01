import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoDynamicLoaderComponent } from './demo-dynamic-loader.component';

describe('DemoDynamicLoaderComponent', () => {
  let component: DemoDynamicLoaderComponent;
  let fixture: ComponentFixture<DemoDynamicLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoDynamicLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoDynamicLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
