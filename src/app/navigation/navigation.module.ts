import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavigationRoutingModule } from './navigation-routing.module';
import { NavigationComponent } from './navigation.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HeaderComponent } from './header/header.component';
import { AuthenticationModule } from '../authentication/module/authentication.module';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [
    NavigationComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    AuthenticationModule,
    NavigationRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatMenuModule
  ],
  providers: [],
  exports: [
    NavigationComponent,
  ]
})
export class NavigationModule {
  public static forRoot() {
    return{
      ngModule: NavigationModule,
      providers: []
    };
  }
 }
