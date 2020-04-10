import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { EmployeeService } from '../service/employee.service';
import {  MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'domainId', 'email','role','schedule','department'];
  EMPLOYEE_DATA:any = [];
  dataSource:any = new MatTableDataSource<any>(); 
  currentUserId: String;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private authService:AuthenticationService,
    private employeeService: EmployeeService) {
    this.authService.userAuthDetails.subscribe(user => {
      this.currentUserId = user.username;
    });
   }
  ngOnInit(): void {
    this.getEmployeeRecords();
  }

  public getEmployeeRecords(){
    this.employeeService.getAllEmployees(this.currentUserId).subscribe(data =>{
      this.EMPLOYEE_DATA = data;
      this.dataSource = new MatTableDataSource(this.EMPLOYEE_DATA);
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
