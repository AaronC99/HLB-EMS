import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { EmployeeService } from '../service/employee.service';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'domainId', 'email','role','schedule','department','status'];
  statusList = [
    {id: 0, value: 'All'},
    {id: 1, value: 'Pending'},
    {id: 2, value: 'Approved'},
    {id: 3, value: 'Rejected'}
  ];
  date:any = new Date();
  localTime = new DatePipe('en-US');
  currentMonth = this.localTime.transform(this.date,'MM');
  currentYear = this.localTime.transform(this.date,'y');
  dateList = [];
  statusArray = [];
  EMPLOYEE_DATA:any = [];
  dataSource:any = new MatTableDataSource<any>(); 
  currentUserId:any;
  searchForm = new FormGroup ({
    status: new FormControl(),
    dateSelected: new FormControl(),
  });
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private formBuilder:FormBuilder,
    private authService:AuthenticationService,
    private employeeService: EmployeeService) {
    this.authService.userAuthDetails.subscribe(user => {
      this.currentUserId = user.username;
    });
   }

  ngOnInit(): void {
    this.displayMonths();
    this.getEmployeeRecords();
    this.createForm();
  }

  public createForm(){
    this.searchForm = this.formBuilder.group({
      status: [this.statusList[0].id,[Validators.required]],
      dateSelected: [this.dateList[this.dateList.length - 1],[Validators.required]]
    });
  }

  public displayMonths(){
    let mon = parseInt(this.currentMonth);
    for(let i = 0; i < mon ; i++){
      let monthName = moment().month(i).format('MMMM');
      this.dateList.push(`${monthName}-${this.currentYear}`);
    }
  }

  public getEmployeeRecords(){
    this.employeeService.getAllEmployees(this.currentUserId).subscribe(data =>{
      console.log(data);
      this.EMPLOYEE_DATA = data;

      let date = [this.dateList[this.dateList.length - 1]];
      let dateString = date[0].split('-',2);
      let month = dateString[0];
      let year = dateString[1];
      let period = parseInt(moment().month(month).format("M")) - 1;
      let filteredArray:any = [];
      this.EMPLOYEE_DATA.forEach(element => {
        element.timesheet_approval.forEach(timesheetObj => {
          if (timesheetObj.period_number === period.toString() && timesheetObj.year === year){
            filteredArray.push(timesheetObj);
          }
        });
        element.timesheet_approval = filteredArray;
      });
      console.log(filteredArray);
      console.log(this.EMPLOYEE_DATA);
      this.dataSource = new MatTableDataSource(this.EMPLOYEE_DATA);
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  get userInput(){
    return this.searchForm.controls;
  }
  
  onSubmit(){
    this.filterTable(this.userInput.status.value,this.userInput.dateSelected.value);
  }

  public filterTable(status,selectedDate){
    let date = (selectedDate).split('-',2);
    let month = date[0];
    let year = date[1];
    let period = parseInt(moment().month(month).format("M")) - 1;
    this.employeeService.getAllEmployees(this.currentUserId)
      .subscribe( data =>{
        this.EMPLOYEE_DATA = data;
        let filteredArray:any = [];
        if (status === 1){ // Pending
          this.EMPLOYEE_DATA.forEach(element => {
            element.timesheet_approval.forEach(info => {
              if (info.approval_status === 'Pending' && info.period_number === period.toString() 
                && info.year === year){
                filteredArray.push(info);
              }
            });
            element.timesheet_approval = filteredArray;
          });
          console.log(filteredArray);
          console.log(this.EMPLOYEE_DATA);
        }else if (status === 2){ // Approved
          this.EMPLOYEE_DATA.forEach(element => {
            element.timesheet_approval.forEach(info => {
              if (info.approval_status === 'Approved' && info.period_number === period.toString() 
                && info.year === year){
                filteredArray.push(info);
              }
            });
            element.timesheet_approval = filteredArray;
          });
          console.log(filteredArray);
          console.log(this.EMPLOYEE_DATA);
        }else if(status === 3){ // Rejected
          this.EMPLOYEE_DATA.forEach(element => {
            element.timesheet_approval.forEach(info => {
              if (info.approval_status === 'Rejected' && info.period_number === period.toString() 
                && info.year === year){
                filteredArray.push(info);
              }
            });
            element.timesheet_approval = filteredArray;
          });
          console.log(filteredArray);
          console.log(this.EMPLOYEE_DATA);
        } else { // All
          this.EMPLOYEE_DATA.forEach(element => {
            element.timesheet_approval.forEach(info => {
              if (info.period_number === period.toString() && info.year === year){
                filteredArray.push(info);
              }
            });
            element.timesheet_approval = filteredArray;
          });
          console.log(filteredArray);
          console.log(this.EMPLOYEE_DATA);
        }
      });
  }

}
