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


@NgModule({
  declarations: [
    AllHolidaysComponent,
    AllDepartmentsComponent,
    CreateDepartmentComponent
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
    MatSortModule
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
