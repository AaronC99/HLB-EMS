import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LateReportComponent } from './late-report.component';

describe('LateReportComponent', () => {
  let component: LateReportComponent;
  let fixture: ComponentFixture<LateReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LateReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
