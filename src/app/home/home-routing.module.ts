import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { CheckInOutPageComponent } from './check-in-out-page/check-in-out-page.component';
import { AccountComponent } from './account/account.component';


const routes: Routes = [
  { 
    path:'', 
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo:'check-in-out',
        pathMatch:'full'
      },
      { 
        path: 'check-in-out',
        component: CheckInOutPageComponent 
      },
      {
        path: 'my-account',
        component: AccountComponent
      }
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
