import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { EmployeeService } from '../service/employee.service';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent {
  date:any;
  timesheetForm = new FormGroup ({
    selectedDate: new FormControl('')
  });
  displayedColumns: string[] = ['date','timeIn','timeOut','ot','ut','lateness','remarks'];
  TIMESHEET_DATA:any;
  dataSource = new MatTableDataSource<any>();
  needRequest:boolean;
  currUserDomainId:any;
  currUserSupervisor:any;
  canDownload:boolean;

  @HostListener('contextmenu',['$event'])
  onRightClick(event){
    event.preventDefault();
  }

  constructor(
    private formBuilder:FormBuilder,
    private employeeService: EmployeeService,
    private authService: AuthenticationService,
    private _snackBar: MatSnackBar
    ) { 
    this.createForm();
    this.authService.userAuthDetails.subscribe( user=> {
      this.currUserDomainId = user.username;
    });
    this.employeeService.getAvailableTimesheet(this.currUserDomainId)
    .subscribe(data => {
      this.date = data;
      this.date.forEach(element => {
        element.period_number++;
      });
    });
  }

  get userInput(){
    return this.timesheetForm.controls;
  }

  createForm(){
    this.timesheetForm = this.formBuilder.group({
      selectedDate: ['',Validators.required]
    });
  }

  displayTimesheet(timesheet){
    let month = this.userInput.selectedDate.value.period_number;
    let year = this.userInput.selectedDate.value.year;
    this.employeeService.getTimesheet(this.currUserDomainId,month,year)
    .subscribe( data => {
      this.TIMESHEET_DATA = data;
      this.dataSource = this.TIMESHEET_DATA;
    });
    if(timesheet.is_approved)
      this.canDownload = true;
    else 
      this.needRequest = true;
  }

  requestApproval(){
    let period =  this.userInput.selectedDate.value.period_number - 1;
    let year = this.userInput.selectedDate.value.year;
    this.employeeService.requestApproval(this.currUserDomainId,period.toString(),year)
      .subscribe(status => {
        if(status !== null)
          this.displayMessage('Request successfully sent to Department Head');  
      },
      err =>{
        console.log(err);
        if (err !== null)
          this.displayMessage('Error sending request. Please try again');
      });
  }

  displayMessage(message:string){
    this._snackBar.open(message,'Close',{
      duration: 3000
    });
  }

  downloadTimesheet(){ 
    console.log('Download Timesheet');
  }
}