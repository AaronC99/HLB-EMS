import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckInOutPageComponent } from './check-in-out-page/check-in-out-page.component';
import { LoginPageComponent } from './login-page/login-page.component';


const routes: Routes = [
  {path: '', redirectTo:'login-page', pathMatch: 'full'},
  {path: 'login-page', component: LoginPageComponent},
  {path: 'check-in-out-page', component: CheckInOutPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }