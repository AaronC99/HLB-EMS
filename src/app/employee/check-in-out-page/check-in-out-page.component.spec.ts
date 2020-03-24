import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInOutPageComponent } from './check-in-out-page.component';

describe('CheckInOutPageComponent', () => {
  let component: CheckInOutPageComponent;
  let fixture: ComponentFixture<CheckInOutPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckInOutPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInOutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
