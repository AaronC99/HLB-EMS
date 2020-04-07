import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { EmployeeService } from 'src/app/employee/service/employee.service';

export interface AllEmployeeRecords {
  name: string;
  domainId: string;
  email: string;
  role: string;
  scheduleName: string;
  departmentName: string;
}
const EMPLOYEE_DATA: AllEmployeeRecords[] = [];
@Component({
  selector: 'app-all-employee-list',
  templateUrl: './all-employee-list.component.html',
  styleUrls: ['./all-employee-list.component.scss']
})
export class AllEmployeeListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'domainId', 'email','role','schedule','department'];
  dataSource:any = new MatTableDataSource(EMPLOYEE_DATA);
  currentUserId: String;
  constructor(
    private authService: AuthenticationService,
    private employeeService: EmployeeService
  ) {
    this.authService.userAuthDetails.subscribe(userId => {
      this.currentUserId = userId.username;
    });
   }

  ngOnInit(): void {
    this.employeeService.getAllEmployees(this.currentUserId).subscribe(data=>{
      this.dataSource = data;
    });
    this.dataSource.filterPredicate = function(data,filter): boolean{
      return data.domainId.toLowerCase().includes(filter);
    };
  }

  applyFilter(event:string) {
    //const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = event.trim().toLowerCase();
  }
}
