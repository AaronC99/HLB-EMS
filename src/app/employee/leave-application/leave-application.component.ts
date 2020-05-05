import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { EmployeeService } from '../service/employee.service';
import { LeaveApproval } from 'src/app/model/LeaveApproval.model';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.component.html',
  styleUrls: ['./leave-application.component.scss']
})
export class LeaveApplicationComponent implements OnInit {
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  leaveTypes = [
    {id:1, value:'Annual Leave'},
    {id:2, value:'Medical Leave'}
  ];
  leaveApplicationForm:FormGroup;
  startDate:any;
  endDate:any;
  leaveDuration = [];
  leave: LeaveApproval;
  minDate:any;
  maxDate:any;
  date = new Date();
  localTime = new DatePipe('en-US');
  currentDay = this.localTime.transform(this.date,'d');
  currentMonth = this.localTime.transform(this.date,'M');
  currentYear = this.localTime.transform(this.date,'yyyy');

  constructor(
    private calendar: NgbCalendar,
    private formBuilder:FormBuilder,
    public formatter: NgbDateParserFormatter,
    private employeeService: EmployeeService,
    private _snackBar: MatSnackBar,
    ) { 
      this.fromDate = calendar.getToday();
      this.toDate = calendar.getNext(calendar.getToday(), 'd', 4);
      this.startDate = `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
      this.endDate = `${this.toDate.day}/${this.toDate.month}/${this.toDate.year}`;
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.leaveApplicationForm = this.formBuilder.group({
      leaveType: ['',Validators.required],
      duration: [`${this.startDate}-${this.endDate}`]
    });
  }

  setMinMaxDate(leaveType){
    if(leaveType.id === 1){
      this.minDate = {
        year: parseInt(this.currentYear),
        month: parseInt(this.currentMonth) + 1,
        day: parseInt(this.currentDay)
      };
      this.maxDate = null;
    } else {
      this.minDate = {
        year: parseInt(this.currentYear),
        month: parseInt(this.currentMonth),
        day: 1
      };
      this.maxDate = {
        year: parseInt(this.currentYear),
        month: parseInt(this.currentMonth),
        day: 31
      };
    }
  }

  get userInput(){
    return this.leaveApplicationForm.controls;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.endDate = `${this.toDate.day}/${this.toDate.month}/${this.toDate.year}`;
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.endDate = `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
    }
    this.startDate = `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
    this.leaveApplicationForm.get('duration').setValue(`${this.startDate} - ${this.endDate}`);
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
    this.leaveDuration.splice(0,this.leaveDuration.length);
    this.startDate = moment(this.formatter.format(this.fromDate));
    this.endDate = moment(this.formatter.format(this.toDate));
    if (this.endDate.format("DD-MM-YYYY") === 'Invalid date')
      this.endDate = this.startDate;

    for(let i=moment(this.startDate); i.isSameOrBefore(this.endDate);i.add(1,'days')){
      let date = i.format("DD-MM");
      let year = i.format("YYYY");
      this.leave = {
        leave_type: this.userInput.leaveType.value,
        date: date,
        year: year
      }
      this.leaveDuration.push(this.leave);
    }
    this.leaveApplicationForm.reset();
  }

  public displayMessage(message:string){
    this._snackBar.open(message,'Close',{
      duration: 3000
    });
  }
}
