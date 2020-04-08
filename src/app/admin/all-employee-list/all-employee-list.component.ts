import { Component, OnInit, ViewChild, AfterViewInit, ComponentFactoryResolver, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { EmployeeService } from 'src/app/employee/service/employee.service';
import { MatSort } from '@angular/material/sort';
import { AdminService } from '../service/admin.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-all-employee-list',
  templateUrl: './all-employee-list.component.html',
  styleUrls: ['./all-employee-list.component.scss'],
})
export class AllEmployeeListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'domainId', 'email','role','schedule','department','edit','status'];
  ELEMENT_DATA: any = [];
  dataSource:any = new MatTableDataSource<any>();
  currentUserId: String;
  checked:boolean = false;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
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
  }

  public getAllEmployeeDetails(){
    this.employeeService.getAllEmployees(this.currentUserId).subscribe( data =>{
      console.log(data[0]);
      this.ELEMENT_DATA = data;
      this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event:Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  public deactivateAccount(currUser:any){
    if(currUser.activated){
      if (confirm("Confirmation Message: \nDo you want to deactivate "+ currUser.domain_id+" ? ")){
        this.adminService.updateEmployee(currUser.domain_id,{activated:false});
      } 
    } else {
      if (confirm("Confirmation Message: \nDo you want to reactivate "+ currUser.domain_id+" ? ")){
        this.adminService.updateEmployee(currUser.domain_id,{activated:true});
      } 
    }
  }

  public editProfileDetails(currUser:any){

    console.log("Edit User: " + currUser.name);
  }

  public showAll($event: MatSlideToggleChange){
    this.checked = $event.checked;
    console.log(this.checked);
  }

  public showInactiveUser(){
    
  }
}
