import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/admin/service/admin.service';
import { Department } from 'src/app/model/Department.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-all-departments',
  templateUrl: './all-departments.component.html',
  styleUrls: ['./all-departments.component.scss']
})
export class AllDepartmentsComponent implements OnInit {
  displayedColumns = ['no','deptName','deptHead','level','edit','status'];
  //_departmentObj:Department;
  activeDept:Department[];
  allDept:Department[];
  dataSource:any = new MatTableDataSource<any>();
  checked: boolean;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  constructor(
    private adminService:AdminService
  ) { }

  ngOnInit(): void {
    this.displayAllDept();
  }

  public displayAllDept(){
    this.adminService.getAllDepartments().subscribe((data:Department[]) => {
      this.allDept = data;
      if(this.checked){
        // Show All
        this.dataSource = new MatTableDataSource<any>(this.allDept);
      } else {
        this.activeDept = this.allDept.filter(dept => dept['activated'] === true);
        this.dataSource = new MatTableDataSource<any>(this.activeDept);
      }
      this.dataSource.sort = this.sort;
    })
  }

  deactivateDept(dept){
    console.log(dept);
  }

  public showAll($event: MatSlideToggleChange){
    this.checked = $event.checked;
    this.displayAllDept();
  }
  
  public editDeptDetails(dept){
    console.log(dept);
  }

}
