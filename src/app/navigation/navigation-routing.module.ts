import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckInOutPageComponent } from '../employee/check-in-out-page/check-in-out-page.component';
import { AccountComponent } from '../employee/account/account.component';
import { TimesheetComponent } from '../employee/timesheet/timesheet.component';
import { NavigationComponent } from './navigation.component';
import { CreateEmployeeComponent } from '../admin/create-employee/create-employee.component';
import { EmployeeListComponent } from '../employee/employee-list/employee-list.component';


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
        path: 'my-account',
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
        path:'employee-list',
        component: EmployeeListComponent
      }
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavigationRoutingModule { }
