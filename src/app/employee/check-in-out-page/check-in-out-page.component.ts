import { Component, OnInit, NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Timesheet } from '../../model/Timesheet.model';
import * as moment from 'moment';

export interface clockInOutElement{
  date: any;
  day: any;
  timeIn: any;
  timeOut: any;
}

const ELEMENT_DATA: clockInOutElement[] = [];
@Component({
  selector: 'app-check-in-out-page',
  templateUrl: './check-in-out-page.component.html',
  styleUrls: ['./check-in-out-page.component.scss']
})
export class CheckInOutPageComponent implements OnInit {
  model = new Timesheet('','','','');
  clockInVisible = true;
  clockOutVisible = false;
  clockIn:any = new Date();
  localTime = new DatePipe('en-US');
  currTime = this.localTime.transform(this.clockIn,'shortTime');
  clockOut = '';
  currDate = this.localTime.transform(this.clockIn,'d-M-yy');
  currDay = this.localTime.transform(this.clockIn,'EEEE');
  displayedColumns: string[] = ['date','day','timeIn','timeOut'];
  dataSource = ELEMENT_DATA;
  now:String;
  constructor() { 
    setInterval(()=>{
       this.now = moment().format('hh:mm:ss a');
    },1000);
  }

  ngOnInit(): void {
  }
  onClockIn(){
    this.clockInVisible = false;
    this.clockOutVisible = true;
    let timesheet = [];
    timesheet.push(this.model);
    this.dataSource = timesheet;
  }
  onClockOut(){
    this.clockOutVisible = false;
    this.clockOut = this.currTime;
  }
}
