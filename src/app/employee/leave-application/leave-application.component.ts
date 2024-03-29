import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { EmployeeService } from '../service/employee.service';
import { LeaveApproval } from 'src/app/model/LeaveApproval.model';
import { AuthModel } from 'src/app/model/Authentication.model';
import { Employee } from 'src/app/model/Employee.model';
import { AdminService } from 'src/app/admin/service/admin.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.component.html',
  styleUrls: ['./leave-application.component.scss']
})
export class LeaveApplicationComponent implements OnInit,OnDestroy {
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
  currentMonth = this.localTime.transform(this.date,'M');
  currentYear = this.localTime.transform(this.date,'yyyy');
  currentUser:AuthModel;
  currentUserSupervisor:Employee;
  currentUserName: string;
  remainingLeaves:number;
  existingLeaves:any = [];
  holidays:any = [];
  isDisabled:any;
  isExceeded: boolean;
  destroy$ : Subject<boolean> = new Subject<boolean>();

  constructor(
    private calendar: NgbCalendar,
    private formBuilder:FormBuilder,
    public formatter: NgbDateParserFormatter,
    private employeeService: EmployeeService,
    private adminService: AdminService
    ) { 
      this.fromDate = this.calendar.getToday();
      this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 0);
      this.startDate = `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
      this.endDate = `${this.toDate.day}/${this.toDate.month}/${this.toDate.year}`;
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
  }

  ngOnInit(): void {
    this.getEmployeeProfile();
    this.getPendingLeaves();
    this.getHolidays();
    this.createForm();
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public getEmployeeProfile(){
    this.employeeService.getProfile(this.currentUser.username)
      .pipe(takeUntil(this.destroy$))
        .subscribe((data:Employee)=>{
          this.currentUserName = data.name;
          this.currentUserSupervisor = data.department.department_head;
        });
  }

  createForm(){
    this.leaveApplicationForm = this.formBuilder.group({
      leaveType: ['',Validators.required]
    });
  }

  isWeekends(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  public disableDates(dates){
    this.isDisabled = (date:NgbDateStruct,current: {month:number,year:number}) =>{
      return dates.find(x=>NgbDate.from(x).equals(date))?true:false;
    }
  }

  public getPendingLeaves(){
    this.employeeService.getExisitingLeavesDates(this.currentUser.username)
    .pipe(takeUntil(this.destroy$))
      .subscribe( data => {
        let existingLeaves:any = data;
        existingLeaves = this.converttedDateStruct(existingLeaves);
        this.mergeInvalidDates(existingLeaves,'leave');
      });
  }

  public getHolidays(){
    this.adminService.viewHolidays()
    .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        let existingHolidays:any = data;
        existingHolidays = this.converttedDateStruct(existingHolidays);
        this.mergeInvalidDates(existingHolidays,'holiday');
      });
  }

  public mergeInvalidDates(dates,type){
    if (type === 'leave')
      this.existingLeaves = dates;
    else if (type === 'holiday')
      this.holidays = dates;

    if(this.existingLeaves.length !== 0 || this.holidays.length !==0){
      let allInvalidDates = [].concat(this.existingLeaves,this.holidays);
      this.disableDates(allInvalidDates);
    }
  }

  public converttedDateStruct(dates){
    let getDate = string => (([day,month]) => ({day,month}))(string.split('-'));
    let datesArray = dates;
    let converttedArray = [];
    datesArray.forEach(element => {
      let day = parseInt(getDate(element.date).day);
        let month = parseInt(getDate(element.date).month);
        let year = parseInt(element.year);
        let fullDate = {
          year: year,
          month:month,
          day:day
        }
        converttedArray.push(fullDate);
    });
    return converttedArray;
  }

  setMinMaxDate(leaveType){
    let month = parseInt(this.currentMonth);
    let year = parseInt(this.currentYear);

    // Get Number of Remaining Leaves
    this.employeeService.checkAvailableLeaves(this.currentUser.username,this.currentYear,leaveType.value)
      .subscribe (data => {
        this.remainingLeaves = data['remaining_leaves'];
      });
    
    if(leaveType.id === 1){ 
      // If is Annual Leave
      let getDate = string => (([day,month,year]) => ({day,month,year}))(string.split('-'));
      this.employeeService.getMinDate(this.currentUser.username)
        .subscribe(data => {
          this.minDate = {
            year: parseInt(getDate(data).year),
            month: parseInt(getDate(data).month),
            day: parseInt(getDate(data).day)
          };
          this.fromDate = this.minDate;
          this.startDate = `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
          this.endDate = `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
        });
      this.maxDate = null;
      this.toDate = null;
    } else { 
      // If is Medical Leave
      let daysOfPrevMon = this.daysInMonth((month-1),year);
      let today = parseInt(this.localTime.transform(this.date,'dd'));
      this.minDate = {
        year: year,
        month: month - 1,
        day: daysOfPrevMon - 6
      };
      this.maxDate = {
        year: year,
        month: month,
        day: today
      };
      this.startDate = `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
      this.endDate = `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
    }
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
    let numDays = this.daysDiff(this.fromDate,this.toDate);
    let total = 0;
    for (let i=0;i<numDays;i++){
      let fullDate = {
        day: this.fromDate.day + i,
        month: this.fromDate.month,
        year: this.fromDate.year
      };
      let isWeekends = this.isWeekends(fullDate);
      let isHoliday = this.isDisabled(fullDate);
      if (!isWeekends && !isHoliday){
        total++;
      }
    }
    if (total > this.remainingLeaves)
      this.isExceeded = true;
    else 
      this.isExceeded = false;
  }

  daysDiff(startDay,endDay){
    let start = moment(this.formatter.format(startDay));
    let end = moment(this.formatter.format(endDay));
    return Math.abs(start.diff(end,'days')) + 1;
  }

  formatNumber(value){
    let formattedNum = ("0" + value).slice(-2);
    return formattedNum
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
        domain_id: this.currentUser.username,
        manager_id: this.currentUserSupervisor.domain_id,
        leave_type: this.userInput.leaveType.value,
        date: date,
        year: year
      };
      let _dateObj = {
        year: parseInt(year),
        month: parseInt(i.format("MM")),
        day: parseInt(i.format("DD"))
      }
      let isWeekend = this.isWeekends(_dateObj);
      let isInvalidDates = this.isDisabled(_dateObj);
      if (!isWeekend && !isInvalidDates)
        this.leaveDuration.push(this.leave);
      else 
        continue;
    }
    this.employeeService.applyLeave(this.leaveDuration,this.currentUserSupervisor.name);
    this.leaveApplicationForm.reset();
  }
}