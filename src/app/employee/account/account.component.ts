import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmployeeService } from '../service/employee.service';
import { Employee } from 'src/app/model/Employee.model';
import { Schedule } from 'src/app/model/Schedule.model';
import { Department } from 'src/app/model/Department.model';
import { Router } from '@angular/router';
import { AuthModel } from 'src/app/model/Authentication.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit,OnDestroy {
  user:AuthModel;
  currUser: Employee;
  currUserSchedule: Schedule;
  currUserDepartment: Department;
  destroy$ : Subject<boolean> = new Subject<boolean>();

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
   }

  ngOnInit(): void {
    this.getProfile();
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public getProfile(){
    this.employeeService.getProfile(this.user.username)
    .pipe(takeUntil(this.destroy$))
      .subscribe((employee:Employee) =>{
        this.currUser = employee;
        this.currUserDepartment = employee.department;
        this.currUserSchedule = employee.schedule;
      });
  } 

  public changePwdPage(){
    this.router.navigateByUrl('/home/new-password-page/'+ this.currUser.domain_id);
  }

  public getTime(time:string){
    return this.employeeService.formatTime(time);
  }
}