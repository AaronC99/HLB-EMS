import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Employee } from 'src/app/employee/employee';
import { LoginPageComponent } from '../login-page/login-page.component';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  access:boolean = false;
  get isLoggedIn(){
    return this.loggedIn.asObservable();
  }
  constructor(
    private router:Router,
  ) { }

  validateUser(domainId:String, domainPass:String){
    //console.log(domainId,domainPass);
    if (domainId === 'user' && domainPass === '123'){
      this.loggedIn.next(true);
      this.access = true;
      return true;
    } else {
      this.loggedIn.next(false);
      return false;
    }
  }
}
