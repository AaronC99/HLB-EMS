import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { BehaviorSubject, Observable } from 'rxjs';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  hide = true;
  showErrorMessage = false;
  title = 'Employee Management System Login'
  placeholderName = 'Domain Name';
  placeholderPass = 'Domain Password';
  errorMessage = '*Incorrect Domain Name/Password';
  loginForm = new FormGroup ({
    domainId: new FormControl(''),
    domainPass: new FormControl(''),
  });
  constructor(
    private formBuilder:FormBuilder,
    private router:Router,
    private authService:AuthenticationService
    ) {
    this.createForm();
    this.authService.loggedIn.subscribe((data)=>{
      if(data !== false){
        this.authService.userAuthDetails.subscribe((data)=>{
          if(data['role'] === 'Admin')
            this.router.navigateByUrl('/home/all-employee');
          else 
            this.router.navigateByUrl('/home');
        });
      }
    });
    
    this.authService.getLoginErrors().subscribe(error=>{
      if (error !== null){
        this.showErrorMessage = true;
      }  
    });
   }

  ngOnInit(): void {
  }

  createForm(){
    this.loginForm = this.formBuilder.group({
      domainId: ['',[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
      domainPass: ['',[Validators.required]]
    });
  }
  getDomainIdError(){
    if(this.userInput.domainId.hasError('required'))
      return 'Invalid Domain Id';
    else return 'Invalid Domain Id';
  }
  getDomainPassError(){
    if (this.userInput.domainPass.hasError('required'))
      return 'Domain Password is required';
  }
  get userInput(){
    return this.loginForm.controls;
  }

  /**
   * Method for Loggin In
   */
  onSubmit() {
    this.authService.getLoginDetails(this.userInput.domainId.value,this.userInput.domainPass.value);
  }
}
