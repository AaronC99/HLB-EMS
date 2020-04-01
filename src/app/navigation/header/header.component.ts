import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { AuthModel } from 'src/app/model/Authentication.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  title = 'Employee Management System';
  clockIn_Out = 'Clock In/Out';
  timesheet = 'Timesheet';
  account = 'My Account';
  employeeList = 'Employee List';
  addEmployee = 'New Employee';
  logout = 'Log Out';
  employeeAccess:any;

  private _authDetails: AuthModel;

  constructor(public authService: AuthenticationService) { 
    this.authService.userAuthDetails.subscribe((details) => {
      this._authDetails = details
      console.log(details.role,details.username);
    });
  }

  ngOnInit(): void {
    //console.log(this._authDetails.username, this._authDetails.role);
  }
  ngAfterContentInit():void{
    //console.log(this._authDetails.username, this._authDetails.role);
  }

}
