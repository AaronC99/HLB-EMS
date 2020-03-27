import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Employee } from 'src/app/employee/employee';
import { LoginPageComponent } from '../login-page/login-page.component';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private REST_API_SERVER = "http://localhost:3000";
  private loggedIn = new BehaviorSubject<boolean>(false);
  access:boolean = false;
  get isLoggedIn(){
    return this.loggedIn.asObservable();
  }
  constructor(
    private router:Router,
    private httpClient: HttpClient
  ) { }

  public getLoginDetails(loginID:string){
    return this.httpClient.get(this.REST_API_SERVER+'/login/'+loginID);
  }

  validateUser(domainId:String, domainPass:String){
    //console.log(domainId,domainPass);
    // if (domainId === 'user' && domainPass === '123'){
    //   this.loggedIn.next(true);
    //   this.access = true;
    //   return true;
    // } else {
    //   this.loggedIn.next(false);
    //   return false;
    // }
    this.getLoginDetails(String(domainId)).subscribe((data)=>{
      console.log(data);
    });
  }
}
