import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayDeclarationComponent } from './holiday-declaration.component';

describe('HolidayDeclarationComponent', () => {
  let component: HolidayDeclarationComponent;
  let fixture: ComponentFixture<HolidayDeclarationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayDeclarationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
