import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AccountComponent } from './account/account.component';
import { CheckInOutPageComponent } from './check-in-out-page/check-in-out-page.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { MatCardModule } from '@angular/material/card';
import { EmployeeListComponent } from './employee-list/employee-list.component';



@NgModule({
  declarations: [
    AccountComponent,
    CheckInOutPageComponent,
    TimesheetComponent,
    EmployeeListComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    FlexLayoutModule,
    MatListModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class EmployeeModule {}
