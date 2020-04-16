import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Timesheet } from '../../model/Timesheet.model';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';

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
  currentDate = this.localTime.transform(this.date,'d-MM-y');
  currentYear = this.localTime.transform(this.date,'y')
  displayedColumns: string[] = ['dateIn','timeIn','dateOut','timeOut'];
  CLOCK_IN_OUT_DATA = [];
  dataSource:any = new MatTableDataSource(this.CLOCK_IN_OUT_DATA);
  currUserId:any;

  constructor(
    private authService: AuthenticationService
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
    //console.log(this.currUserId);
    // load table from API
    /*
      if (data.date_in !== time.sheet.date_in){
        
      }
    */ 
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
    //console.log(this.currUserId,this.timesheet);
    console.log('Arguments send to API: ' + this.currUserId,this.currentDate,this.currentTime,this.currentYear);
    // Pass clock in time and date to api
  }

  onClockOut(){
    this.clockOutButton = false;
    this.timesheet.date_out = this.currentDate;
    this.timesheet.time_out= this.currentTime;
    this.CLOCK_IN_OUT_DATA.push(this.timesheet);
    //console.log(this.currUserId,this.timesheet);
    console.log('Arguments for clock out send to API: '+ this.currUserId,this.timesheet.date_out,this.timesheet.time_out,this.currentYear);
    // Pass clock out time and date to api
  }
}
