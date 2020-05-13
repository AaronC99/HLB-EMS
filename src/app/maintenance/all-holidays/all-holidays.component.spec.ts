import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllHolidaysComponent } from './all-holidays.component';

describe('AllHolidaysComponent', () => {
  let component: AllHolidaysComponent;
  let fixture: ComponentFixture<AllHolidaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllHolidaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllHolidaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
