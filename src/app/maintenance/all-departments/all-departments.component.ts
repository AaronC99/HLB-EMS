import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/admin/service/admin.service';
import { Department } from 'src/app/model/Department.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MaintenanceService } from '../service/maintenance.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-all-departments',
  templateUrl: './all-departments.component.html',
  styleUrls: ['./all-departments.component.scss']
})
export class AllDepartmentsComponent implements OnInit {
  displayedColumns = ['no','deptName','deptHead','level','edit','status'];
  activeDept:Department[];
  allDept:Department[];
  dataSource:any = new MatTableDataSource<any>();
  checked: boolean;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  destroy$ : Subject<boolean> = new Subject<boolean>();
  
  constructor(
    private adminService:AdminService,
    private maintainService: MaintenanceService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.displayAllDept();
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public displayAllDept(){
    this.adminService.getAllDepartments()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:Department[]) => {
      this.allDept = data;
      if(this.checked){
        // Show All
        this.dataSource = new MatTableDataSource<any>(this.allDept);
      } else {
        // Show Only Active 
        this.activeDept = this.allDept.filter(dept => dept['activated'] === true);
        this.dataSource = new MatTableDataSource<any>(this.activeDept);
      }
      this.dataSource.sort = this.sort;
    })
  }

  public updateDeptStatus(dept){
    if (dept.activated){
      if (confirm("Confirmation Message: \nDo you want to deactivate "+ dept.department_name + " ? ")){
        let deactivateDept = {
          _id: dept._id,
          activated: false
        };
        this.maintainService.editDepartment(deactivateDept);
        this.displayAllDept();
      }
    } else {
      if (confirm("Confirmation Message: \nDo you want to reactivate "+ dept.department_name +" ? ")){
        let reactivateDept = {
          _id: dept._id,
          activated: true
        };
        this.maintainService.editDepartment(reactivateDept);
        this.displayAllDept();
      } 
    }
  }

  public showAll($event: MatSlideToggleChange){
    this.checked = $event.checked;
    this.displayAllDept();
  }
  
  public editDeptDetails(dept){
    let deptId = dept._id;
    let deptName = dept.department_name;
    this.maintainService.setDeptToEdit(dept);
    this.router.navigateByUrl(`/home/edit-department/${deptId}&${deptName}`);
  }

}
