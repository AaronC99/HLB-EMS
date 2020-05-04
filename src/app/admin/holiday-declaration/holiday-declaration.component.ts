import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-holiday-declaration',
  templateUrl: './holiday-declaration.component.html',
  styleUrls: ['./holiday-declaration.component.scss']
})
export class HolidayDeclarationComponent implements OnInit {
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  holidayTypes = ['Working','Non-Working'];
  createHolidayForm:FormGroup;
  startDate = '';
  endDate = '';

  constructor(
    calendar: NgbCalendar,
    private formBuilder:FormBuilder,
    ) { 
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 4);
    this.startDate = `${this.fromDate.day}-${this.fromDate.month}-${this.fromDate.year}`;
    this.endDate = `${this.toDate.day}-${this.toDate.month}-${this.toDate.year}`;
    //this.admin = localStorage.getItem('currentUser');
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.createHolidayForm = this.formBuilder.group({
      holidayName: ['',Validators.required],
      holidayType: ['',Validators.required],
      duration: ['']
    });
  }

  get userInput(){
    return this.createHolidayForm.controls;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  onSubmit(){
    // console.log(`${this.fromDate.day}-${this.fromDate.month}-${this.fromDate.year}`
    //   ,`${this.toDate.day}-${this.toDate.month}-${this.toDate.year}`)
    console.table(this.createHolidayForm.value);
  }
}
