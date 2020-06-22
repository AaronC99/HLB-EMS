import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDepartmentsComponent } from './all-departments.component';

describe('AllDepartmentsComponent', () => {
  let component: AllDepartmentsComponent;
  let fixture: ComponentFixture<AllDepartmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllDepartmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
