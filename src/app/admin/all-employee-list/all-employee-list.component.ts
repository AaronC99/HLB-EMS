import { Component, OnInit, ViewChild, AfterViewInit, ComponentFactoryResolver, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { EmployeeService } from 'src/app/employee/service/employee.service';
import { MatSort } from '@angular/material/sort';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Employee } from 'src/app/model/Employee.model';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-all-employee-list',
  templateUrl: './all-employee-list.component.html',
  styleUrls: ['./all-employee-list.component.scss'],
  // animations: [
  //   trigger('detailExpand', [
  //     state('collapsed', style({height: '0px', minHeight: '0'})),
  //     state('expanded', style({height: '*'})),
  //     transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  //   ]),
  // ],
})
export class AllEmployeeListComponent implements OnInit,AfterViewInit {
  displayedColumns: string[] = ['name', 'domainId', 'email','role','schedule','department','edit','status'];
  dataSource:any = new MatTableDataSource<any>();
  currentUserId: String;
  expandedRow:number;
  @ViewChild(MatSort, {static: true}) set matSort(sort: MatSort){
    this.dataSource.sort = sort;
  }
  constructor(
    private authService: AuthenticationService,
    private employeeService: EmployeeService,
    private adminService: AdminService
  ) {
    this.authService.userAuthDetails.subscribe(userId => {
      this.currentUserId = userId.username;
    });
   }
  
  ngOnInit(): void {
    this.getAllEmployeeDetails();
    //this.dataSource.sort = this.sort;
  }

  ngAfterViewInit():void{
    //this.dataSource.sort = this.sort;
  }

  public getAllEmployeeDetails(){
    this.employeeService.getAllEmployees(this.currentUserId).subscribe(data=>{
      this.dataSource = data;
    });
  }

  applyFilter(filterValue:string) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
    console.log(this.dataSource);
  }

  public deactivateAccount(currUser:any){
    this.adminService.updateEmployee(currUser.domain_id,{activated:false});
  }

  public editProfileDetails(currUser:any){
    console.log("Edit User: " + currUser.name);
  }
}
