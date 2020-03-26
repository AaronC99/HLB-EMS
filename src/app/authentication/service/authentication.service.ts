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
}
