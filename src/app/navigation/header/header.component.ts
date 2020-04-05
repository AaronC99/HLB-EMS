import { Component, OnInit, AfterContentInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { AuthModel } from 'src/app/model/Authentication.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{

  title = 'Employee Management System';
  clockIn_Out = 'Clock In/Out';
  timesheet = 'Timesheet';
  account:String;
  employeeList = 'Employee List';
  addEmployee = 'New Employee';
  logout = 'Log Out';
  employeeAccess: any;
  _authDetails: AuthModel;

  constructor(private authService: AuthenticationService) {
    this.authService.userAuthDetails.subscribe((details) => {
      this._authDetails = details;
      this.account = details.username;
    });
  }
}
