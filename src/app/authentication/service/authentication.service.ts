import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Employee } from 'src/app/employee/employee';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private REST_API_SERVER = "http://localhost:3000";
  public loggedIn = new BehaviorSubject<boolean>(false);
  public isEmployee:boolean = true;
  get isLoggedIn(){
    return this.loggedIn.asObservable();
  }
  constructor(
    private router:Router,
    private httpClient: HttpClient
  ) { }

  public getLoginDetails(loginID:string, pwd:string){
    return this.httpClient.get(this.REST_API_SERVER+'/login/'+loginID+'/'+pwd);
  }

  validateUser(domainId:String, domainPass:String){
    this.getLoginDetails(String(domainId),String(domainPass)).subscribe((data)=>{
      console.log(data);
      if (data !== null){
        this.loggedIn.next(true);
        this.router.navigateByUrl('/home');
      }else 
        this.loggedIn.next(false);
    });
  }
}
