import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../service/employee.service';
import { Employee } from 'src/app/model/Employee.model';
import { Schedule } from 'src/app/model/Schedule.model';
import { Department } from 'src/app/model/Department.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  currUser: Employee;
  currUserSchedule: Schedule;
  currUserDepartment: Department;
  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeService.currUserDetails.subscribe((details)=>{
      this.currUser = details;
      this.currUserSchedule = details.schedule;
      this.currUserDepartment = details.department;
    });
   }

  ngOnInit(): void {
    this.currUser.domain_id = this.route.snapshot.paramMap.get('domain_id');
    this.employeeService.getProfileDetails(this.currUser.domain_id);
  }

  changePwdPage(){
    this.router.navigateByUrl('/home/new-password-page')
  }

}
