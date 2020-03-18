import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  //show = false;
  title = 'Employee Management System';
  clockIn_Out = 'Clock In/Out';
  timesheet = 'Timesheet';
  account = 'My Account';
  constructor() { }

  ngOnInit(): void {
  }

}
