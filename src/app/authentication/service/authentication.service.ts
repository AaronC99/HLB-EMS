import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthModel } from 'src/app/model/Authentication.model';

@Injectable()
export class AuthenticationService {
  private REST_API_SERVER = "http://localhost:3000";
  public loggedIn = new BehaviorSubject<boolean>(false);
  // private currentUserSubject:BehaviorSubject<Employee>;
  // public currentUser:Observable<Employee>;
  // public access:boolean;
  public role: string;


  private _authObj: AuthModel = new AuthModel();
  private _authSubj: BehaviorSubject<AuthModel>;

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get userAuthDetails() {
    return this._authSubj.asObservable();
  }

  constructor(
    private router: Router,
    private httpClient: HttpClient
  ) {
    this._authSubj = new BehaviorSubject(this._authObj);
    this._authSubj.next(this._authObj);
   }

  public getLoginDetails(loginID: string, pwd: string){
    this.httpClient.get(this.REST_API_SERVER+'/login/'+loginID+'/'+pwd)
    .subscribe((data) => {
      if (data === undefined) {
        console.log("User Not Found");
      } else {
        this.role = data['role']; //get role in string

        this._authObj = {
          username: loginID, 
          role: this.role
        };

        console.log(this._authObj.username,this._authObj.role);

        this._authSubj.next(this._authObj);
        this.loggedIn.next(true);
        this.router.navigateByUrl('/home'); // Do not do navigation on services
      }
    });    
  }
}
