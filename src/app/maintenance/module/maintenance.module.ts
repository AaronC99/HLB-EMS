import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllHolidaysComponent } from '../all-holidays/all-holidays.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaintenanceService } from '../service/maintenance.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AllDepartmentsComponent } from '../all-departments/all-departments.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CreateDepartmentComponent } from '../create-department/create-department.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AllScheduleComponent } from '../all-schedule/all-schedule.component';
import { CreateScheduleComponent } from '../create-schedule/create-schedule.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    AllHolidaysComponent,
    AllDepartmentsComponent,
    CreateDepartmentComponent,
    AllScheduleComponent,
    CreateScheduleComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgbModule,
    MatSnackBarModule,
    MatTableModule,
    MatSlideToggleModule,
    MatSortModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatListModule
  ]
})
export class MaintenanceModule { 
  public static forRoot(){
    return{
      NgModule: MaintenanceModule,
      providers: [
        MaintenanceService
      ]
    };
  }
}
