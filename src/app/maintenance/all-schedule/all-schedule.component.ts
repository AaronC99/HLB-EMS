import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AdminService } from 'src/app/admin/service/admin.service';
import { Schedule } from 'src/app/model/Schedule.model';

@Component({
  selector: 'app-all-schedule',
  templateUrl: './all-schedule.component.html',
  styleUrls: ['./all-schedule.component.scss']
})
export class AllScheduleComponent implements OnInit {
  displayedColumns = ['no','scheduleName','daysOfWork','startTime','endTime','edit','status'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource:any = new MatTableDataSource<any>();
  checked: boolean;
  allSchedules: Schedule[] = [];
  activeSchedules: Schedule[] = [];

  constructor(
    private adminService: AdminService
  ) {
   }

  ngOnInit(): void {
    this.displayAllSkd();
  }

  public showAll($event: MatSlideToggleChange){
    this.checked = $event.checked;
    this.displayAllSkd();
  }

  public displayAllSkd(){
    this.adminService.getAllSchedules().subscribe((data:Schedule[]) => {
      this.allSchedules = data;
      console.log(this.allSchedules);
      if(this.checked){
        // Show All
        this.dataSource = new MatTableDataSource<any>(this.allSchedules);
      } else {
        // Show Only Active 
        this.activeSchedules = this.allSchedules.filter(dept => dept['activated'] === true);
        this.dataSource = new MatTableDataSource<any>(this.activeSchedules);
      }
      this.dataSource.sort = this.sort;
    });
  }

  public editSkdDetails(schedule){
    console.log(schedule);
  }

  public updateSkdStatus(schedule){
    console.log(schedule);
  }

}
