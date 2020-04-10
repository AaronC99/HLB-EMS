import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../service/employee.service';
import { Employee } from 'src/app/model/Employee.model';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { Schedule } from 'src/app/model/Schedule.model';
import { Department } from 'src/app/model/Department.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  currUser: Employee;
  currUserSchedule: Schedule;
  currUserDepartment: Department;
  currUserName:String;
  constructor(
    private employeeService: EmployeeService,
    private authService: AuthenticationService
  ) {
    this.employeeService.currUserDetils.subscribe((details)=>{
      this.currUser = details;
      this.currUserSchedule = {
          schedule_name: details.schedule['schedule_name'],
          days_of_work: details.schedule['days_of_work'],
          start_time: details.schedule['start_time'],
          end_time: details.schedule['end_time']
      }
      this.currUserDepartment = details.department;
    });
    this.authService.userAuthDetails.subscribe(user=>{
      this.currUserName = user.username;
    });
   }

  ngOnInit(): void {
    this.employeeService.getProfileDetails(this.currUserName);
  }


}
