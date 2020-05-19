import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckInOutPageComponent } from '../employee/check-in-out-page/check-in-out-page.component';
import { AccountComponent } from '../employee/account/account.component';
import { TimesheetComponent } from '../employee/timesheet/timesheet.component';
import { NavigationComponent } from './navigation.component';
import { CreateEmployeeComponent } from '../admin/create-employee/create-employee.component';
import { EmployeeListComponent } from '../employee/employee-list/employee-list.component';
import { AllEmployeeListComponent } from '../admin/all-employee-list/all-employee-list.component';
import { HolidayDeclarationComponent } from '../admin/holiday-declaration/holiday-declaration.component';
import { LeaveApplicationComponent } from '../employee/leave-application/leave-application.component';
import { AllHolidaysComponent } from '../maintenance/all-holidays/all-holidays.component';
import { ChangePasswordComponent } from '../employee/change-password/change-password.component';

const routes: Routes = [
  { 
    path:'', 
    component: NavigationComponent,
    children: [
      {
        path: '',
        redirectTo:'check-in-out',
        pathMatch:'full'
      },
      { 
        path: 'check-in-out',
        component: CheckInOutPageComponent
      },
      {
        path: 'my-account/:domain_id',
        component: AccountComponent
      },
      {
        path:'timesheet',
        component: TimesheetComponent
      },
      {
        path:'new-employee',
        component: CreateEmployeeComponent
      },
      {
        path:'edit-employee/:domain_id',
        component: CreateEmployeeComponent
      },
      {
        path:'employee-list',
        component: EmployeeListComponent
      },
      {
        path: 'all-employee',
        component: AllEmployeeListComponent
      },
      {
        path: 'holiday-declaration',
        component: HolidayDeclarationComponent
      },
      {
        path:'leave-application',
        component: LeaveApplicationComponent
      },
      {
        path: 'all-holiday',
        component: AllHolidaysComponent
      },
      {
        path: 'edit-holiday/:holidayId',
        component: HolidayDeclarationComponent
      },
      {
        path: 'new-password-page',
        component: ChangePasswordComponent
      }
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavigationRoutingModule { }
