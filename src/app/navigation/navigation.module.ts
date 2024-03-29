import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavigationRoutingModule } from './navigation-routing.module';
import { NavigationComponent } from './navigation.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from './header/header.component';
import { AuthenticationModule } from '../authentication/module/authentication.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment.prod';

const config: SocketIoConfig = { url: environment.websocket_api_url, options: {} };

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
    MatMenuModule,
    MatBadgeModule,
    MatCardModule,
    SocketIoModule.forRoot(config)
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
