import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../service/employee.service';
import { AuthModel } from 'src/app/model/Authentication.model';
import { Employee } from 'src/app/model/Employee.model';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { Schedule } from 'src/app/model/Schedule.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  currUser: Employee;
  currUserSchedule: Schedule;
  currUserName:String;
  constructor(
    private employeeService: EmployeeService,
    private authService: AuthenticationService
  ) {
    this.employeeService.currUserDetils.subscribe((details)=>{
      this.currUser = details;
      this.currUserSchedule = details.schedule;
      console.log(this.currUserSchedule);
    });
    this.authService.userAuthDetails.subscribe(user=>{
      this.currUserName = user.username;
    });
   }

  ngOnInit(): void {
    this.employeeService.getProfileDetails(this.currUserName);
  }


}
