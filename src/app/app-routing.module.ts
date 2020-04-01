import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './authentication/login-page/login-page.component';
import { NavigationModule } from './navigation/navigation.module';
import { AuthenticationGuard } from './authentication/service/authentication.guard';


const routes: Routes = [
  {path: '', redirectTo:'login-page', pathMatch: 'full'},
  {path: 'login-page', component: LoginPageComponent},
  {path: 'home',loadChildren: ()=> NavigationModule}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
