import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
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
  clockInButton = true;
  clockOutButton = false;
  clock:string;
  currentTime:string;
  date:any = new Date();
  localTime = new DatePipe('en-US');
  currentDay = this.localTime.transform(this.date,'EEEE');
  currentMonth = this.localTime.transform(this.date,'MM');
  currentDate = this.localTime.transform(this.date,'dd-MM-y');
  dateIn = this.localTime.transform(this.date,'dd-MM');
  currentYear = this.localTime.transform(this.date,'y')
  displayedColumns: string[] = ['dateIn','timeIn','timeOut','dateOut'];
  CLOCK_IN_OUT_DATA:any = [];
  dataSource:any = new MatTableDataSource<any>();
  currUserId:any;
  constructor(
    private authService: AuthenticationService,
    private employeeService: EmployeeService
  ) { 
    setInterval(()=>{
       this.clock = moment().format('hh:mm:ss A');
       this.currentTime = moment().format('HH:mm');
    },1000);
    this.authService.userAuthDetails.subscribe( currentUser => {
      this.currUserId = currentUser.username;
    });
  }

  ngOnInit(): void {
    this.displayClockInOut();
  }

 public displayClockInOut(){
    this.employeeService.getCurrUserClockInOut(this.currUserId,this.currentMonth,this.currentYear)
    .subscribe( data => {
      const ALL_DATA:any = data;
      this.CLOCK_IN_OUT_DATA = ALL_DATA.filter( data => 
        parseInt(data.date_in) <= parseInt(this.dateIn)
      );
      this.CLOCK_IN_OUT_DATA.forEach(element => {
        if(element.date_in === this.dateIn && element.time_out === '0000'){
          this.clockInButton = false;
          this.clockOutButton = true;
        }else {
          this.clockInButton = false;
          this.clockOutButton = false;
        }
        this.dataSource = new MatTableDataSource<any>(this.CLOCK_IN_OUT_DATA);
      });
    });
  }

  onClockIn(){
    this.clockInButton = false;
    this.clockOutButton = true;
    let timeIn = moment().format('HHmm');
    this.employeeService.clockIn(this.currUserId,this.dateIn,timeIn,this.currentYear);
    this.displayClockInOut();
  }

  onClockOut(){
    this.clockOutButton = false;
    let dateOut = this.localTime.transform(this.date,'dd-MM');
    let timeOut = moment().format('HHmm');
    this.employeeService.clockOut(this.currUserId,this.dateIn,dateOut,timeOut,this.currentYear);
    this.displayClockInOut();
  }
}
