import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Employee } from 'src/app/employee/employee';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private router:Router
  ) { }

  validateUser(domainId:String, domainPass:String){
    //console.log(domainId,domainPass);
    if (domainId === 'user' && domainPass === '123'){
      return true;
    } else {
      return false;
    }
  }
}
