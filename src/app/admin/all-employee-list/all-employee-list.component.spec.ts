import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEmployeeListComponent } from './all-employee-list.component';

describe('AllEmployeeListComponent', () => {
  let component: AllEmployeeListComponent;
  let fixture: ComponentFixture<AllEmployeeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllEmployeeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllEmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
