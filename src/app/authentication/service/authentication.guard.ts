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
          take(123),
          map((isLoggedIn:Boolean)=>{
            if(!isLoggedIn){
              this.router.navigateByUrl('/login-page');
              return false;
            }
            return true;
          })
        )
   }
  // canActivateChild(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  // canDeactivate(
  //   component: unknown,
  //   currentRoute: ActivatedRouteSnapshot,
  //   currentState: RouterStateSnapshot,
  //   nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  // canLoad(
  //   route: Route,
  //   segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
  //   return true;
  // }
}
