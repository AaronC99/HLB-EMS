import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
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
    private httpClient: HttpClient
  ) {
    this._authSubj = new BehaviorSubject<AuthModel>(JSON.parse(localStorage.getItem('currentUser')));
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

  get currentUserValue(): AuthModel {
    return this._authSubj.value;
  }


  getLoginDetails = (loginID: string, pwd: string) => {
    this.httpClient.get(this.REST_API_SERVER+'/login/'+loginID+'/'+pwd)
    .subscribe((data) => {
      if (data === null) {
        this.loginErrorSubject.next("Invalid User");
        this.loggedIn.next(false);
      } else {
        this.role = data['role'];
        this._authObj = {
          username: loginID, 
          role: this.role
        };
        localStorage.setItem('currentUser',JSON.stringify(this._authObj));
        this._authSubj.next(this._authObj);
        this.loggedIn.next(true);
      }
    },error => {
      this.loginErrorSubject.next(error.message);
    });    
  }

  logout(){
    localStorage.removeItem('currentUser');
    this.loggedIn.next(false);
    this._authSubj.next(new AuthModel());
  }
}
