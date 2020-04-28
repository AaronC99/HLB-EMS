import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate{ 
  
  constructor(
    private authService: AuthenticationService,
    private router:Router
  ){}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean>{
      return this.authService.isLoggedIn
        .pipe(
          map((isLoggedIn:Boolean)=>{
            if(!isLoggedIn){
              this.router.navigate(['login-page'],{queryParams: {returnUrl: state.url}});
              return false;
            }
            return true;
          })
        )
   }
  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  //   const currentUser = this.authService.currentUserValue;
  //   if(currentUser){
  //     if(route.data.roles && route.data.roles.indexOf(currentUser.role) === -1){
  //       this.router.navigate(['/']);
  //       return false;
  //     }
  //     return true;
  //   }
  //   this.router.navigate(['login-page'],{queryParams: {returnUrl: state.url}});
  //   return true;
  // }
}
