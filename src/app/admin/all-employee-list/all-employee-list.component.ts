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
export class AllEmployeeListComponent implements OnInit{
  displayedColumns: string[] = ['name', 'domainId', 'email','role','schedule','department','edit','status'];
  ALL_DATA: any = [];
  ACTIVE_DATA:any = [];
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
      
      this.ALL_DATA = data;
      if (this.checked){
        this.dataSource = new MatTableDataSource<any>(this.ALL_DATA);
      }else {
        this.ALL_DATA.forEach(element => {
          if (element.activated === true){
            this.ACTIVE_DATA = this.ALL_DATA.filter(user => user.activated === true);
            this.dataSource = new MatTableDataSource<any>(this.ACTIVE_DATA);
          }
        });
      }
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
        this.getAllEmployeeDetails();
      } 
    } else {
      if (confirm("Confirmation Message: \nDo you want to reactivate "+ currUser.domain_id+" ? ")){
        this.adminService.updateEmployee(currUser.domain_id,{activated:true});
        this.getAllEmployeeDetails();
      } 
    }
  }

  public editProfileDetails(currUser:any){

    console.log("Edit User: " + currUser.name);
  }

  public showAll($event: MatSlideToggleChange){
    this.checked = $event.checked;
    this.getAllEmployeeDetails();
  }

}
