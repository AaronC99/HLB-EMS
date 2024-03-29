import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { AuthModel } from 'src/app/model/Authentication.model';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/admin/service/admin.service';
import { MaintenanceService } from 'src/app/maintenance/service/maintenance.service';
import { NotificationService } from 'src/app/notification/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  title = 'Employee Management System';
  clockIn_Out = 'Clock In/Out';
  timesheet = 'Timesheet';
  account:String;
  employeeList = 'Employee List';
  addEmployee = 'New Employee';
  logout = 'Log Out';
  _authDetails: AuthModel;
  notifsNum:number;
  notificationList = [];

  constructor(
    private authService: AuthenticationService,
    private router:Router,
    private adminService: AdminService,
    private maintenanceService: MaintenanceService,
    private notifService: NotificationService
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

  ngOnInit(){
    this.getAllNotifs();
  }

  getAllNotifs(){
    this.notifService.getNotifications()
    .subscribe((notifs:any[]) => {
      this.notificationList = notifs.filter(notif => notif['domain_id'] === this._authDetails.username);
      this.notifsNum = this.notificationList.length;
    })
  }

  openNotif(notif){
    if (notif.link !== ''){
      this.router.navigate([]).then( result => {
        window.open( notif.link, '_blank');
      });
      this.removeNotif(notif);
    }
  }

  removeNotif(notif){
    let seenNotif = {
      notif_id:notif._id,
      domain_id:notif.domain_id
    };
    this.notifService.markAsSeen(seenNotif);
    this.getAllNotifs();
  }

  convertTime(time){
    let meridien = '';
    let newHour = '';
    let hour:number = parseInt(time.substring(0,2));
    let minute = time.substring(2,4);
    if(hour > 12 ){
      newHour = (hour - 12).toString();
      meridien = 'PM';
    } else if (hour < 12){
      newHour = hour.toString();
      meridien = 'AM';
    } else {
      newHour = hour.toString();
      meridien = 'PM';
    }
    return `${newHour}:${minute} ${meridien}`;
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
