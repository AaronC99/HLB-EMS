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


@NgModule({
  declarations: [
    AccountComponent,
    CheckInOutPageComponent,
    TimesheetComponent,
    EmployeeListComponent
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
    MatSnackBarModule
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
