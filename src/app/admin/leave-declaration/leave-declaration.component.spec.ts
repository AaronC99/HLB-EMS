import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveDeclarationComponent } from './leave-declaration.component';

describe('LeaveDeclarationComponent', () => {
  let component: LeaveDeclarationComponent;
  let fixture: ComponentFixture<LeaveDeclarationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveDeclarationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
