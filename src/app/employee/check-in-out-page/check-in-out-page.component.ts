import { Component, OnInit, NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Timesheet } from '../../model/Timesheet.model';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-check-in-out-page',
  templateUrl: './check-in-out-page.component.html',
  styleUrls: ['./check-in-out-page.component.scss']
})
export class CheckInOutPageComponent implements OnInit {
  timesheet: Timesheet;
  clockInVisible = true;
  clockOutVisible = false;
  clock:string;
  date:any = new Date();
  localTime = new DatePipe('en-US');
  currentTime:string;
  currentDay = this.localTime.transform(this.date,'EEEE');
  currentDate = this.localTime.transform(this.date,'d-MM-y');
  displayedColumns: string[] = ['dateIn','timeIn','dateOut','timeOut'];
  ELEMENT_DATA = [];
  dataSource:any = new MatTableDataSource(this.ELEMENT_DATA);

  constructor() { 
    setInterval(()=>{
       this.clock = moment().format('hh:mm:ss A');
       this.currentTime = moment().format('HH:mm');
    },1000);
  }

  ngOnInit(): void {
    // load table from API
  }
  onClockIn(){
    this.clockInVisible = false;
    this.clockOutVisible = true;
    this.timesheet = {
      date_in: this.currentDate,
      time_in: this.currentTime,
      date_out: null,
      time_out: null
    }
    this.ELEMENT_DATA.push(this.timesheet);
    this.dataSource = this.ELEMENT_DATA;
  }

  onClockOut(){
    this.clockOutVisible = false;
    this.timesheet.date_out = this.currentDate;
    this.timesheet.time_out= this.currentTime;
    this.ELEMENT_DATA.push(this.timesheet);
    console.log(this.timesheet);
  }
}
