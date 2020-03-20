import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomeModule } from './home/home.module';


const routes: Routes = [
  {path: '', redirectTo:'login-page', pathMatch: 'full'},
  {path: 'login-page', component: LoginPageComponent},
  {path: 'home', loadChildren: ()=> HomeModule}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
