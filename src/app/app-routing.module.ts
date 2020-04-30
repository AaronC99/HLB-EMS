import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './authentication/login-page/login-page.component';
import { NavigationModule } from './navigation/navigation.module';
import { AuthenticationGuard } from './authentication/service/authentication.guard';
import { ApprovalPageComponent } from './employee/approval-page/approval-page.component';


const routes: Routes = [
  {
    path: '', 
    redirectTo:'login-page', 
    pathMatch: 'full'
  },
  {
    path: 'login-page', 
    component: LoginPageComponent
  },
  {
    path: 'home',
    canActivate:[AuthenticationGuard],
    loadChildren: ()=> NavigationModule
  },
  {
    path: 'timesheet-approval/:domainId/:period/:year',
    canActivate:[AuthenticationGuard],
    component: ApprovalPageComponent
  },
  {
    path:'timesheet-reject/:domainId/:period/:year',
    canActivate:[AuthenticationGuard],
    component: ApprovalPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
