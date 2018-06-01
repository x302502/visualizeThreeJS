import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoScheduleComponent } from './demo-schedule.component';

describe('DemoScheduleComponent', () => {
  let component: DemoScheduleComponent;
  let fixture: ComponentFixture<DemoScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
