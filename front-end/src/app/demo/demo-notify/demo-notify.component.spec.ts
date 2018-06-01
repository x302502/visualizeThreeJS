import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoNotifyComponent } from './demo-notify.component';

describe('DemoNotifyComponent', () => {
  let component: DemoNotifyComponent;
  let fixture: ComponentFixture<DemoNotifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoNotifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
