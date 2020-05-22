import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from '../service/employee.service';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Employee } from 'src/app/model/Employee.model';
import { AuthModel } from 'src/app/model/Authentication.model';

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
  EMPLOYEE_DATA:any = [];
  dataSource:any = new MatTableDataSource<any>(); 
  currentUser:AuthModel;
  searchForm = new FormGroup ({
    status: new FormControl(),
    dateSelected: new FormControl()
  });
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private formBuilder:FormBuilder,
    private employeeService: EmployeeService,
    private router:Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
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

  public displayStatus(row){
    if (row.timesheet_approval.approval_status === 'Pending' && row.timesheet_approval.date_submitted === null)
      return 'Not Submitted';
    else
      return row.timesheet_approval.approval_status;
  }

  public getEmployeeRecords(){
    this.employeeService.getAllEmployees(this.currentUser.username)
    .subscribe((data) => {
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
            filteredArray = timesheetObj;
          }
        });
        element.timesheet_approval = filteredArray;
      });
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
    this.employeeService.getAllEmployees(this.currentUser.username)
      .subscribe( data =>{
        this.EMPLOYEE_DATA = data;
        // If timesheet status is Pending
        if (status === 1){ 
          this.EMPLOYEE_DATA.forEach(element => {
            element.timesheet_approval.forEach(info => {
              if (info.approval_status === 'Pending' && info.period_number === period.toString() 
                && info.year === year){
                element.timesheet_approval = info;
              }
            });
          });
          this.EMPLOYEE_DATA = this.EMPLOYEE_DATA.filter(item => 
            item.timesheet_approval.approval_status === 'Pending' && 
            item.timesheet_approval.period_number === period.toString() &&
            item.timesheet_approval.year === year
          );
        }else if (status === 2){ 
          // If timesheet status is Approved
          this.EMPLOYEE_DATA.forEach(element => {
            element.timesheet_approval.forEach(info => {
              if (info.approval_status === 'Approved' && info.period_number === period.toString() 
                && info.year === year){
                element.timesheet_approval = info;
              }
            });
          });
          this.EMPLOYEE_DATA = this.EMPLOYEE_DATA.filter(item => 
            item.timesheet_approval.approval_status === 'Approved' && 
            item.timesheet_approval.period_number === period.toString() &&
            item.timesheet_approval.year === year
          );
        }else if(status === 3){ 
          // If timesheet status is Rejected
          this.EMPLOYEE_DATA.forEach(element => {
            element.timesheet_approval.forEach(info => {
              if (info.approval_status === 'Rejected' && info.period_number === period.toString() 
                && info.year === year){
                element.timesheet_approval = info;
              }
            });
          });
          this.EMPLOYEE_DATA = this.EMPLOYEE_DATA.filter(item => 
            item.timesheet_approval.approval_status === 'Rejected' && 
            item.timesheet_approval.period_number === period.toString() &&
            item.timesheet_approval.year === year
          );
        } else { 
          // Display All timesheet status
          this.EMPLOYEE_DATA.forEach(element => {
            element.timesheet_approval.forEach(info => {
              if (info.period_number === period.toString() && info.year === year){
                element.timesheet_approval = info;
              }
            });
          });
        }
        this.dataSource = new MatTableDataSource(this.EMPLOYEE_DATA);
      });
  }

  public approveTimesheet(currentUser){
    let timesheet = currentUser.timesheet_approval;
    let period = timesheet.period_number;
    let year = timesheet.year;
    let link = `timesheet-approval/${currentUser.domain_id}/${period}/${year}`;
    this.router.navigateByUrl(link);
  }

}
