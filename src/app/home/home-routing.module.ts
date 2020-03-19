import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { CheckInOutPageComponent } from './check-in-out-page/check-in-out-page.component';


const routes: Routes = [
  { 
    path:'', 
    component: HomeComponent,
    // redirectTo:'check-in-out',
    // pathMatch:'full',
    children: [
      {
        path: '',
        redirectTo:'check-in-out',
        pathMatch:'full'
      },
      { 
        path: 'check-in-out',
        component: CheckInOutPageComponent },
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
