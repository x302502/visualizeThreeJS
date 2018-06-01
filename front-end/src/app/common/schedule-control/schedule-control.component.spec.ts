import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleControlComponent } from './schedule-control.component';

describe('ScheduleControlComponent', () => {
  let component: ScheduleControlComponent;
  let fixture: ComponentFixture<ScheduleControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
