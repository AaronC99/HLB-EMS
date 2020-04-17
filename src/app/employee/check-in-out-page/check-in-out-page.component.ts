import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Timesheet } from '../../model/Timesheet.model';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { EmployeeService } from '../service/employee.service';

@Component({
  selector: 'app-check-in-out-page',
  templateUrl: './check-in-out-page.component.html',
  styleUrls: ['./check-in-out-page.component.scss']
})

export class CheckInOutPageComponent implements OnInit {
  timesheet: Timesheet;
  clockInButton = true;
  clockOutButton = false;
  clock:string;
  currentTime:string;
  date:any = new Date();
  localTime = new DatePipe('en-US');
  currentDay = this.localTime.transform(this.date,'EEEE');
  currentDate = this.localTime.transform(this.date,'dd-MM-y');
  dateIn = this.localTime.transform(this.date,'dd-MM');
  currentYear = this.localTime.transform(this.date,'y')
  displayedColumns: string[] = ['dateIn','timeIn','dateOut','timeOut'];
  CLOCK_IN_OUT_DATA = [];
  dataSource:any = new MatTableDataSource(this.CLOCK_IN_OUT_DATA);
  currUserId:any;

  constructor(
    private authService: AuthenticationService,
    private employeeService: EmployeeService
  ) { 
    setInterval(()=>{
       this.clock = moment().format('hh:mm:ss A');
       this.currentTime = moment().format('HH:mm');
    },1000);
  }

  ngOnInit(): void {
    this.authService.userAuthDetails.subscribe( name => {
      this.currUserId = name.username;
    });
  }

  onClockIn(){
    this.clockInButton = false;
    this.clockOutButton = true;
    this.timesheet = {
      domain_id: this.currUserId,
      date_in: this.currentDate,
      time_in: this.currentTime,
      date_out: null,
      time_out: null
    }
    this.CLOCK_IN_OUT_DATA.push(this.timesheet);
    this.dataSource = this.CLOCK_IN_OUT_DATA;
    let timeIn = moment().format('HHmm');
    //console.log('Clock In: ' + this.currUserId,this.dateIn,timeIn,this.currentYear);
    this.employeeService.clockIn(this.currUserId,this.dateIn,timeIn,this.currentYear);
  }

  onClockOut(){
    this.clockOutButton = false;
    this.timesheet.date_out = this.currentDate;
    this.timesheet.time_out= this.currentTime;
    this.CLOCK_IN_OUT_DATA.push(this.timesheet);
    let dateOut = this.localTime.transform(this.date,'dd-MM');
    let timeOut = moment().format('HHmm');
    //console.log('Clock Out: '+ this.currUserId,this.dateIn,dateOut,timeOut,this.currentYear);
    this.employeeService.clockOut(this.currUserId,this.dateIn,dateOut,timeOut,this.currentYear);
  }
}
