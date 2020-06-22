import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationModule } from './authentication/module/authentication.module';
import { EmployeeModule } from './employee/module/employee.module';
import { AdminModule } from './admin/module/admin.module';
import { NavigationModule } from './navigation/navigation.module';
import { MaintenanceModule } from './maintenance/module/maintenance.module';
import { BnNgIdleService } from 'bn-ng-idle'; 

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AuthenticationModule.forRoot(),
    EmployeeModule,
    AdminModule,
    NavigationModule,
    MaintenanceModule
  ],
  providers: [
    BnNgIdleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
