import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from 'src/app/employee/service/employee.service';
import { MatSort } from '@angular/material/sort';
import { AdminService } from '../service/admin.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { AuthModel } from 'src/app/model/Authentication.model';
import { Employee } from 'src/app/model/Employee.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-all-employee-list',
  templateUrl: './all-employee-list.component.html',
  styleUrls: ['./all-employee-list.component.scss'],
})
export class AllEmployeeListComponent implements OnInit,OnDestroy{
  displayedColumns: string[] = ['name', 'domainId', 'email','role','schedule','department','edit','status'];
  ALL_DATA: any = [];
  ACTIVE_DATA:any = [];
  dataSource:any = new MatTableDataSource<any>();
  currentUser: AuthModel;
  checked:boolean = false;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  destroy$ : Subject<boolean> = new Subject<boolean>();

  constructor(
    private employeeService: EmployeeService,
    private adminService: AdminService,
    private router: Router
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
   }
  
  ngOnInit(): void {
    this.getAllEmployeeDetails();
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public getAllEmployeeDetails(){
    this.employeeService.getAllEmployees(this.currentUser.username)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:Employee[]) => {
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

  public updateAccStatus(currUser:Employee){
    if(currUser['activated']){
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

  public editProfileDetails(currUser) {
    this.adminService.userToEdit = currUser;
    this.router.navigateByUrl(`/home/edit-employee/${currUser.domain_id}`);
  }

  public showAll($event: MatSlideToggleChange){
    this.checked = $event.checked;
    this.getAllEmployeeDetails();
  }
}