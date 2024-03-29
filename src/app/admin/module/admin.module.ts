import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateEmployeeComponent } from '../create-employee/create-employee.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AllEmployeeListComponent } from '../all-employee-list/all-employee-list.component';
import { AdminService } from '../service/admin.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HolidayDeclarationComponent } from '../holiday-declaration/holiday-declaration.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    CreateEmployeeComponent,
    AllEmployeeListComponent,
    HolidayDeclarationComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatSlideToggleModule,
    NgbModule,
    MatSnackBarModule
  ]
})
export class AdminModule {
  public static forRoot() {
    return{
      ngModule: AdminModule,
      providers: [
        AdminService
      ]
    };
  }
 }
