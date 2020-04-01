import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Employee } from 'src/app/employee/employee';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private REST_API_SERVER = "http://localhost:3000";
  public loggedIn = new BehaviorSubject<boolean>(false);
  private currentUserSubject:BehaviorSubject<Employee>;
  public currentUser:Observable<Employee>;
  public access:boolean;
  public role:string;

  get isLoggedIn(){
    return this.loggedIn.asObservable();
  }

  constructor(
    private router:Router,
    private httpClient: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<Employee>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
   }

  public getLoginDetails(loginID:string, pwd:string){//Observable
    return this.httpClient.get(this.REST_API_SERVER+'/login/'+loginID+'/'+pwd)
    .subscribe((data) => {
      if (data === null){
        console.log("User Not Found");
        return false
      }else{
        this.role = data['role']; //get role in string
        if (this.role ===  "Manager"){
          console.log(this.role);
        } else if (this.role === "Admin"){
          console.log(this.role);
        } 
      }
    });    
  }

  validateUser(domainId:string, domainPass:string){
    this.getLoginDetails(domainId,domainPass);
    // this.getRole(domainId,domainPass).then((data)=>{
    //   this.role = data['role'].toString();
    // })
    console.log("VU Function: " + this.role);

    // this.getLoginDetails(domainId,domainPass).then((data)=>{
    //   this.role = data;
    //   return this.role;
    // });
    // console.log(this.role)
    
  }

}
