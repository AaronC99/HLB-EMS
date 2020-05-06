import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { EmployeeService } from '../service/employee.service';
import { LeaveApproval } from 'src/app/model/LeaveApproval.model';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { AuthModel } from 'src/app/model/Authentication.model';
import { Employee } from 'src/app/model/Employee.model';

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
    {id:1, value:'Annual'},
    {id:2, value:'Medical'}
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
  showCalendar:boolean = false;
  showDateInput:boolean = false;
  currentUser:AuthModel;
  currentUserSupervisor:Employee;

  constructor(
    private calendar: NgbCalendar,
    private formBuilder:FormBuilder,
    public formatter: NgbDateParserFormatter,
    private employeeService: EmployeeService,
    private _snackBar: MatSnackBar,
    private authService: AuthenticationService
    ) { 
      this.currentDate();
      this.startDate = `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
      this.endDate = `${this.toDate.day}/${this.toDate.month}/${this.toDate.year}`;
      this.authService.userAuthDetails.subscribe( userInfo => {
        this.currentUser = userInfo;
      });
      this.employeeService.getProfile(this.currentUser.username)
        .subscribe(data=>{
          this.currentUserSupervisor = data['department']['department_head'];
        });
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

  currentDate(){
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 0);
  }

  setMinMaxDate(leaveType){
    let month = parseInt(this.currentMonth);
    let year = parseInt(this.currentYear);
    if(leaveType.id === 1){ // If is Annual Leave
      this.minDate = {
        year: year,
        month: month + 1,
        day: parseInt(this.currentDay)
      };
      this.maxDate = null;
      this.fromDate = this.calendar.getNext(this.calendar.getToday(),'m',1);
      this.toDate = null;
    } else { // If is Medical Leave
      this.minDate = {
        year: year,
        month: month,
        day: 1
      };
      let maxDay= this.daysInMonth(month,year);
      this.maxDate = {
        year: parseInt(this.currentYear),
        month: month,
        day: maxDay
      };
      this.currentDate();
    }
    this.startDate = `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
    this.endDate = `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
    this.leaveApplicationForm.get('duration').setValue(`${this.startDate} - ${this.endDate}`);
    this.showDateInput = true;
  }

  public daysInMonth(month,year){
    return new Date(year,month,0).getDate();
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
    let leaveDetailsApproval = [];
    this.leaveDuration.splice(0,this.leaveDuration.length);
    this.startDate = moment(this.formatter.format(this.fromDate));
    this.endDate = moment(this.formatter.format(this.toDate));
    if (this.endDate.format("DD-MM-YYYY") === 'Invalid date')
      this.endDate = this.startDate;

    for(let i=moment(this.startDate); i.isSameOrBefore(this.endDate);i.add(1,'days')){
      let date = i.format("DD-MM");
      let year = i.format("YYYY");
      this.leave = {
        domain_id: this.currentUser.username,
        manager_id: this.currentUserSupervisor.domain_id,
        leave_type: this.userInput.leaveType.value,
        date: date,
        year: year
      };
      let leaveApprovalEmail = {
        domain_id: this.currentUser.username,
        leave_type: this.userInput.leaveType.value,
        date: date,
        year: year
      };
      this.leaveDuration.push(this.leave);
      leaveDetailsApproval.push(leaveApprovalEmail);
    }
    console.log(this.leaveDuration);
    // this.employeeService.applyLeave(this.leaveDuration)
    //   .subscribe(data => {
    //     if (data !==  null) 
    //       this.displayMessage('Leave Request Successful')
    //     else 
    //       this.displayMessage('Leave Request Unsuccessful. Please try again.')
    // });
    //this.employeeService.sendEmail(leaveDetailsApproval)
    this.leaveApplicationForm.reset();
  }

  public displayMessage(message:string){
    this._snackBar.open(message,'Close',{
      duration: 3000
    });
  }
}
