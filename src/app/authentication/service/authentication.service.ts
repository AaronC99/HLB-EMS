import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthModel } from 'src/app/model/Authentication.model';

@Injectable()
export class AuthenticationService {
  private REST_API_SERVER = "http://localhost:3000";
  public loggedIn = new BehaviorSubject<boolean>(false);
  public role: string;
  private _authObj: AuthModel = new AuthModel();
  private _authSubj: BehaviorSubject<AuthModel>;
  private loginErrorSubject = new Subject<string>();

  constructor(
    private router: Router,
    private httpClient: HttpClient
  ) {
    this._authSubj = new BehaviorSubject(this._authObj);
    this._authSubj.next(this._authObj);
   }

  getLoginErrors():Subject<string>{
    return this.loginErrorSubject;
  } 
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get userAuthDetails() {
    return this._authSubj.asObservable();
  }


  getLoginDetails = (loginID: string, pwd: string) => {
    this.httpClient.get(this.REST_API_SERVER+'/login/'+loginID+'/'+pwd)
    .subscribe((data) => {
      if (data === null) {
        this.loginErrorSubject.next("Invalid User");
        this.loggedIn.next(false);
      } else {
        this.role = data['role']; //get role in string
        this._authObj = {
          username: loginID, 
          role: this.role
        };
        console.log(this._authObj.username,this._authObj.role);
        this._authSubj.next(this._authObj);
        this.loggedIn.next(true);
      }
    },error => {
      this.loginErrorSubject.next(error.message);
    });    
  }

  logout(){
    this.loggedIn.next(false);
    this._authSubj.next(null);
  }
}
