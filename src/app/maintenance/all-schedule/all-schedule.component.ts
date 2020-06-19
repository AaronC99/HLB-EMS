import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AdminService } from 'src/app/admin/service/admin.service';
import { Schedule } from 'src/app/model/Schedule.model';
import { MaintenanceService } from '../service/maintenance.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-all-schedule',
  templateUrl: './all-schedule.component.html',
  styleUrls: ['./all-schedule.component.scss']
})
export class AllScheduleComponent implements OnInit,OnDestroy {
  displayedColumns = ['no','scheduleName','daysOfWork','startTime','endTime','edit','status'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource:any = new MatTableDataSource<any>();
  checked: boolean;
  allSchedules: Schedule[] = [];
  activeSchedules: Schedule[] = [];
  destroy$ : Subject<boolean> = new Subject<boolean>();

  constructor(
    private adminService: AdminService,
    private maintainService: MaintenanceService,
    private router: Router
  ) {
   }

  ngOnInit(): void {
    this.displayAllSkd();
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public showAll($event: MatSlideToggleChange){
    this.checked = $event.checked;
    this.displayAllSkd();
  }

  public displayAllSkd(){
    this.adminService.getAllSchedules()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:Schedule[]) => {
      this.allSchedules = data;
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
    let skdId = schedule._id;
    let skdName = schedule.schedule_name;
    this.maintainService.setSkdToEdit(schedule);
    this.router.navigateByUrl(`/home/edit-schedule/${skdId}&${skdName}`);
  }

  public updateSkdStatus(schedule){
    if (schedule.activated){
      if (confirm("Confirmation Message: \nDo you want to deactivate "+ schedule.schedule_name+ " ? ")){
        let deactivateSkd = {
          _id: schedule._id,
          activated: false
        };
        this.maintainService.editSchedule(deactivateSkd);
        this.displayAllSkd();
      }
    } else {
      if (confirm("Confirmation Message: \nDo you want to reactivate "+ schedule.schedule_name +" ? ")){
        let reactivateSkd = {
          _id: schedule._id,
          activated: true
        };
        this.maintainService.editSchedule(reactivateSkd);
        this.displayAllSkd();
      } 
    }
  }
}