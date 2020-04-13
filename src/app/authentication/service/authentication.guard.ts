import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { LoginPageComponent } from '../login-page/login-page.component';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate{ //CanActivateChild, CanDeactivate<unknown>, CanLoad 
  
  constructor(
    private authService: AuthenticationService,
    private router:Router
  ){}
  canActivate(
      next: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean>{
      return this.authService.isLoggedIn
        .pipe(
          map((isLoggedIn:Boolean)=>{
            if(!isLoggedIn){
              this.router.navigateByUrl('');
              return false;
            }
            return true;
          })
        )
   }
}
