import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Employee } from 'src/app/employee/employee';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // private loggedIn = new BehaviorSubject<boolean>(false);

  // get isLoggedIn(){
  //   return this.isLoggedIn.asObservable();
  // } 
  constructor(
    private router:Router
  ) { }

  // login(user:Employee){
  //   if (user.domainId == 'taaron' && user.domainPass == '123'){
  //     this.loggedIn.next(true);
  //     this.router.navigate(['/home']);
  //     return true;
  //   }else {
  //     console.log('Incorrect');
  //     return false;
  //   }
  // }

  // logout(){
  //   this.loggedIn.next(false);
  //   this.router.navigate(['/login-page']);
  // }
  // isEmployee(string name,string){
  //   name = ''
  // }
}
