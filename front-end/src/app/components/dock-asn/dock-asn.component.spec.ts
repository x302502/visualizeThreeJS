import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DockAsnComponent } from './dock-asn.component';

describe('DockAsnComponent', () => {
  let component: DockAsnComponent;
  let fixture: ComponentFixture<DockAsnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DockAsnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DockAsnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
