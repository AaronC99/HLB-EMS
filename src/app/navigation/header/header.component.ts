import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { Observable } from 'rxjs/internal/Observable';

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
  isLoggedIn$: Observable<boolean>;
  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
  }

}
