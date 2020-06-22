import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from '../service/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthModel } from 'src/app/model/Authentication.model';
import { Timesheet } from 'src/app/model/Timesheet.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-check-in-out-page',
  templateUrl: './check-in-out-page.component.html',
  styleUrls: ['./check-in-out-page.component.scss']
})

export class CheckInOutPageComponent implements OnInit,OnDestroy {
  clockInButton = true;
  clockOutButton = false;
  clock:string;
  date:any = new Date();
  localTime = new DatePipe('en-US');
  currentDay = this.localTime.transform(this.date,'EEEE');
  currentMonth = this.localTime.transform(this.date,'MM');
  currentDate = this.localTime.transform(this.date,'dd-MM-y');
  today = this.localTime.transform(this.date,'dd-MM');
  currentYear = this.localTime.transform(this.date,'y');
  displayedColumns: string[] = ['dateIn','day','timeIn','timeOut','dateOut'];
  CLOCK_IN_OUT_DATA:Timesheet[] = [];
  dataSource:any = new MatTableDataSource<any>();
  currentUser:AuthModel;
  yesterday = this.localTime.transform(this.date.setDate(this.date.getDate() - 1),'dd-MM');
  @ViewChild('dialogBox',{ static: true }) dialog_box: TemplateRef<any>;
  destroy$ : Subject<boolean> = new Subject<boolean>();

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog
  ) { 
    setInterval(()=>{
       this.clock = moment().format('hh:mm:ss A');
    },1000);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit(): void {
    this.displayClockInOut();
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public filterTable(table:any){
    this.CLOCK_IN_OUT_DATA = table.filter( data => 
      parseInt(data.date_in) <= parseInt(this.today)
    );
    this.CLOCK_IN_OUT_DATA = this.CLOCK_IN_OUT_DATA.reverse();
  }

  public clockInOutValidation(dataTable:any){
    this.employeeService.getClockInOutStatus(this.currentUser.username)
    .pipe(takeUntil(this.destroy$))
      .subscribe( data => {
        if (dataTable.length === 0 && data['last_clock_in']){
          this.clockInButton = false;
          this.clockOutButton = true;
        }
        dataTable.forEach(element => { 
          //If yesterday forget to colock out
          if(element.date_in === this.yesterday && element.time_in !== '0000' && 
            element.time_out === '0000' && data['last_clock_in'] === true
            && element.remarks !== 'Weekend'){
            this.openModal(this.dialog_box);
          }// For clocking in
          else if (element.date_in === this.today && element.time_in === '0000' && data['last_clock_in'] === false){
            this.clockInButton = true;
          }// For Clocking out
          else if(element.date_in === this.today && element.time_in !== '0000' && data['last_clock_in'] === true){
            this.clockInButton = false;
            this.clockOutButton = true;
          }// After clock in and clock out 
          else if (element.date_in === this.today && element.time_in !== '0000' && 
            element.time_out !== '0000' && data['last_clock_in'] === false){
            this.clockInButton = false;
            this.clockOutButton = false;
          }// For Clocking Out Previous Days 
          else if (element.time_in !== '0000' && element.time_out === '0000' && data['last_clock_in']){
            this.clockInButton = false;
            this.clockOutButton = true;
          }
        });
      });
  }

 public displayClockInOut(){
    this.employeeService.getTimesheet(this.currentUser.username,this.currentMonth,this.currentYear)
    .pipe(takeUntil(this.destroy$))  
      .subscribe((data:Timesheet[]) => {
        this.CLOCK_IN_OUT_DATA = data;
        this.filterTable(this.CLOCK_IN_OUT_DATA);
        this.clockInOutValidation(this.CLOCK_IN_OUT_DATA);
        this.dataSource = this.CLOCK_IN_OUT_DATA;
      });
  }

  public getDayName(date,year){
    let fullDate = moment(`${date}-${year}`,'DD-MM-YYYY');
    return fullDate.format('dddd');
  }

  public getFormattedTime(time:string){
    return this.employeeService.formatTime(time);
  }

  public updateTable(status:number){
    if (status === 1){
      this.employeeService.clockIn(this.currentUser.username)
      .subscribe((data:Timesheet[]) =>{
        this.CLOCK_IN_OUT_DATA = data;
        this.filterTable(this.CLOCK_IN_OUT_DATA);
        this.clockInOutValidation(this.CLOCK_IN_OUT_DATA);
        this.dataSource = this.CLOCK_IN_OUT_DATA;
      });
    } else if (status === 2){
        this.employeeService.clockOut(this.currentUser.username)
        .subscribe (( data:Timesheet[]) => {
          this.CLOCK_IN_OUT_DATA = data;
          this.filterTable(this.CLOCK_IN_OUT_DATA);
          this.clockInOutValidation(this.CLOCK_IN_OUT_DATA);
          this.dataSource = this.CLOCK_IN_OUT_DATA;
        });      
    }
  }

  onClockIn(){
    this.clockInButton = false;
    this.clockOutButton = true;
    this.updateTable(1);
  }

  onClockOut(){
    this.clockOutButton = false;
    this.updateTable(2);
  }

  openModal(dialogBox) {
    let dialogRef = this.dialog.open(dialogBox, {
        width: '500px',
        height:'250px',
        disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.updateTable(2);
    });
  }
}