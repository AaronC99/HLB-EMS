import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { EmployeeService } from '../service/employee.service';
import { MatDialog } from '@angular/material/dialog';

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
  dateOut = this.localTime.transform(this.date,'dd-MM');
  currentYear = this.localTime.transform(this.date,'y');
  timeOut = moment().format('HHmm');
  displayedColumns: string[] = ['dateIn','timeIn','timeOut','dateOut'];
  CLOCK_IN_OUT_DATA:any = [];
  dataSource:any = new MatTableDataSource<any>();
  currUserId:any;
  yesterday = this.localTime.transform(this.date.setDate(this.date.getDate() - 1),'dd-MM');
  @ViewChild('dialogBox',{ static: true }) dialog_box: TemplateRef<any>;

  constructor(
    private authService: AuthenticationService,
    private employeeService: EmployeeService,
    private dialog: MatDialog
  ) { 
    setInterval(()=>{
       this.clock = moment().format('hh:mm:ss A');
       this.currentTime = moment().format('HH:mm');
    },1000);
    // this.authService.userAuthDetails.subscribe( currentUser => {
    //   this.currUserId = currentUser.username;
    // });
    let _currUserObj:any = JSON.parse(localStorage.getItem('currentUser'));
    this.currUserId = _currUserObj.username;
  }

  ngOnInit(): void {
    this.displayClockInOut();
  }

  public filterTable(table:any){
    this.CLOCK_IN_OUT_DATA = table.filter( data => 
      parseInt(data.date_in) <= parseInt(this.dateIn)
    );
  }

  public clockInOutValidation(dataTable:any){
    dataTable.forEach(element => {
      if(element.date_in === this.yesterday && element.time_in !== '0000' && element.time_out === '0000' 
        && element.remarks !== 'Weekend'){
        this.openModal(this.dialog_box);
      }
      else if (element.date_in === this.dateIn && element.time_in === '0000' && element.time_out === '0000'){
        this.clockInButton = true;
      }
      else if(element.date_in === this.dateIn && element.time_in !== '0000' && element.time_out === '0000'){
        this.clockInButton = false;
        this.clockOutButton = true;
      }
      else {
        this.clockInButton = false;
        this.clockOutButton = false;
      }
    });
  }

 public displayClockInOut(){
    this.employeeService.getTimesheet(this.currUserId,this.currentMonth,this.currentYear)
      .subscribe( data => {
        this.CLOCK_IN_OUT_DATA = data;
        this.filterTable(this.CLOCK_IN_OUT_DATA);
        this.clockInOutValidation(this.CLOCK_IN_OUT_DATA);
        this.dataSource = this.CLOCK_IN_OUT_DATA;
      });
  }

  public updateTable(status:number){
    if (status === 1){
      const timeIn = moment().format('HHmm');
      this.employeeService.clockIn(this.currUserId).subscribe( data =>{
        this.CLOCK_IN_OUT_DATA = data;
        this.filterTable(this.CLOCK_IN_OUT_DATA);
        this.clockInOutValidation(this.CLOCK_IN_OUT_DATA);
        this.dataSource = this.CLOCK_IN_OUT_DATA;
      });
    } else if (status === 2){
        this.employeeService.clockOut(this.currUserId,this.dateIn,this.currentYear)
        .subscribe ( data => {
          this.CLOCK_IN_OUT_DATA = data;
          this.filterTable(this.CLOCK_IN_OUT_DATA);
          this.clockInOutValidation(this.CLOCK_IN_OUT_DATA);
          this.dataSource = this.CLOCK_IN_OUT_DATA;
        });      
    } else if (status === 3){
      this.employeeService.clockOut(this.currUserId,this.yesterday,this.currentYear)
      .subscribe ( data => {
        this.CLOCK_IN_OUT_DATA = data;
        this.filterTable(this.CLOCK_IN_OUT_DATA);
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
      this.updateTable(3);
    });
  }
}
