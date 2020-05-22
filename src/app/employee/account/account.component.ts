import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../service/employee.service';
import { Employee } from 'src/app/model/Employee.model';
import { Schedule } from 'src/app/model/Schedule.model';
import { Department } from 'src/app/model/Department.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthModel } from 'src/app/model/Authentication.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  user:AuthModel;
  currUser: Employee;
  currUserSchedule: Schedule;
  currUserDepartment: Department;
  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
   }

  ngOnInit(): void {
    this.employeeService.getProfile(this.user.username)
      .subscribe((employee:Employee) =>{
        this.currUser = employee;
        this.currUserDepartment = employee.department;
        this.currUserSchedule = employee.schedule;
      });
  }

  changePwdPage(){
    this.router.navigateByUrl('/home/new-password-page')
  }
}