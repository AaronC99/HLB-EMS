import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate{ 
  
  constructor(
    private authService: AuthenticationService,
    private router:Router
  ){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    if(currentUser && this.authService.isLoggedIn){
      return true;
    }
    this.router.navigate(['login-page'],{queryParams: {returnUrl: state.url}});
    return false;
  }
}
