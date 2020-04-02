import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { BehaviorSubject } from 'rxjs';
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
      if(data === false){
        this.showErrorMessage = true;
        console.log(data);
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
