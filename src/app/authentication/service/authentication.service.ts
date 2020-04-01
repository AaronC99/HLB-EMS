import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Employee } from 'src/app/employee/employee';
import { map, catchError } from 'rxjs/operators';
import { AuthModel } from 'src/app/model/Authentication.model';

@Injectable()
export class AuthenticationService {
  private REST_API_SERVER = "http://localhost:3000";
  public loggedIn = new BehaviorSubject<boolean>(false);
  // private currentUserSubject:BehaviorSubject<Employee>;
  // public currentUser:Observable<Employee>;
  // public access:boolean;
  public role:string;


  private _authObj: AuthModel = new AuthModel();
  private _authSubj: BehaviorSubject<AuthModel>;
  
  get isLoggedIn(){
    return this.loggedIn.asObservable();
  }

  get userAuthDetails() {
    return this._authSubj.asObservable();
  }

  constructor(
    private router:Router,
    private httpClient: HttpClient
  ) {
    this._authSubj = new BehaviorSubject(this._authObj);
    this._authSubj.next(this._authObj);
   }

  public getLoginDetails(loginID:string, pwd:string){//Observable
    return this.httpClient.get(this.REST_API_SERVER+'/login/'+loginID+'/'+pwd)
    .subscribe((data) => {
      if (data === null){
        console.log("User Not Found");
        return false;
      } else {
        this.role = data['role']; //get role in string

        this._authObj = {
          username: loginID, 
          role: this.role
        };
        console.log(this._authObj.username,this._authObj.role)
        this._authSubj.next(this._authObj);
        this.router.navigateByUrl('/home');

      }
    });    
  }
}
