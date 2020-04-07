import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { EmployeeService } from '../service/employee.service';
import {  MatSort } from '@angular/material/sort';

export interface EmployeeRecords {
  name: string;
  domainId: string;
  email: string;
  role: string;
  scheduleName: string;
  departmentName: string;
  
}
const EMPLOYEE_DATA: EmployeeRecords[] = [];
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'domainId', 'email','role','schedule','department'];
  dataSource:any = new MatTableDataSource(EMPLOYEE_DATA); 
  currentUserId: String;
  constructor(
    private authService:AuthenticationService,
    private employeeService: EmployeeService) {
    this.authService.userAuthDetails.subscribe(user => {
      this.currentUserId = user.username;
    });
   }
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  ngOnInit(): void {
    this.getEmployeeRecords();
  }


  public getEmployeeRecords(){
    this.employeeService.getAllEmployees(this.currentUserId).subscribe(data =>{
      this.dataSource = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
