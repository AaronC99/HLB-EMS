import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AccountComponent } from '../account/account.component';
import { CheckInOutPageComponent } from '../check-in-out-page/check-in-out-page.component';
import { TimesheetComponent } from '../timesheet/timesheet.component';
import { MatCardModule } from '@angular/material/card';
import { EmployeeListComponent } from '../employee-list/employee-list.component';
import { EmployeeService } from '../service/employee.service';
import { AuthenticationModule } from 'src/app/authentication/module/authentication.module';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ApprovalPageComponent } from '../approval-page/approval-page.component';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LeaveApplicationComponent } from '../leave-application/leave-application.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LeaveApprovalComponent } from '../leave-approval/leave-approval.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ManagerDashboardComponent } from '../manager-dashboard/manager-dashboard.component';


@NgModule({
  declarations: [
    AccountComponent,
    CheckInOutPageComponent,
    TimesheetComponent,
    EmployeeListComponent,
    ApprovalPageComponent,
    LeaveApplicationComponent,
    LeaveApprovalComponent,
    ChangePasswordComponent,
    ManagerDashboardComponent
  ],
  imports: [
    CommonModule,
    AuthenticationModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatSortModule,
    MatSnackBarModule,
    RouterModule,
    MatDialogModule,
    MatCheckboxModule,
    NgbModule
  ]
})
export class EmployeeModule {
  public static forRoot() {
    return{
      ngModule: EmployeeModule,
      providers: [
        EmployeeService
      ]
    };
  }
}
