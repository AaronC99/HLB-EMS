import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';


@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
  ],
  providers:[],
  exports: [
    HomeComponent,
  ]
})
export class HomeModule {
  public static forRoot(){
    return{
      ngModule: HomeModule,
      providers: []
    };
  }
 }
