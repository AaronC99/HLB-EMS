import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationModule } from './authentication/module/authentication.module';
import { EmployeeModule } from './employee/module/employee.module';
import { AdminModule } from './admin/module/admin.module';
import { AllEmployeeListComponent } from './admin/all-employee-list/all-employee-list.component';

@NgModule({
  declarations: [
    AppComponent,
    AllEmployeeListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AuthenticationModule.forRoot(),
    EmployeeModule,
    AdminModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
