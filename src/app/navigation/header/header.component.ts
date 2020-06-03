import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { AuthModel } from 'src/app/model/Authentication.model';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/admin/service/admin.service';
import { MaintenanceService } from 'src/app/maintenance/service/maintenance.service';

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
  _authDetails: AuthModel;
  notificationList = ['Notif 1','Notif 2','Notif 3'];

  constructor(
    private authService: AuthenticationService,
    private router:Router,
    private adminService: AdminService,
    private maintenanceService: MaintenanceService
    ) {
      this._authDetails = JSON.parse(localStorage.getItem('currentUser'));
      this.account = this._authDetails.username;
      this.authService.verifyUserIdle();
      this.authService.userIsIdle.subscribe(isIdle => {
        if (isIdle){
          this.onLogOut();
        }
      });
  }

  openNotif(notif){
    // Redirect to aprroval page if notif is timesheet request
    console.log(notif)
  }

  newEmployeePage(){
    this.adminService.userToEdit = null;
  }

  newHolidayPage(){
    this.maintenanceService.setHolidayToEdit = null;
  }

  newDeptPage(){
    this.maintenanceService.setDeptToEdit(null);
  }

  newSchedulePage(){
    this.maintenanceService.setSkdToEdit(null);
  }

  onLogOut(){
    this.authService.logout();
    this.router.navigateByUrl('login-page');
  }
}
