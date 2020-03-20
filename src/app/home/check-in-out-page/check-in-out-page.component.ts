import { Component, OnInit, NgModule } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DatePipe } from '@angular/common';
import { Timesheet } from '../timesheet';

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
  time: any = new Observable(observer =>
    window.setInterval(() => observer.next(new Date().toString()), 1000).toString
  );
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
  timeTest: string = 'test'; 

  constructor() { 
  }

  ngOnInit(): void {
  }
  onClockIn(){
    this.clockInVisible = false;
    // console.log('Clock In Time: ' + this.currTime);
    // console.log(this.currDate);
    // console.log(this.currDay);
    this.clockOutVisible = true;
    let newArrayList = [];
    newArrayList.push(this.model);
    this.dataSource = newArrayList;
  }
  onClockOut(){
    this.clockOutVisible = false;
    //console.log('Clock Out Time: ' + this.currTime);
    this.clockOut = this.currTime;
  }
}
