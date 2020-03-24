import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
// import {HeaderComponent } from '../header/header.component'
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  hide = true;
  title = 'Employee Management System Login'
  placeholderName = 'Domain Name';
  placeholderPass = 'Domain Password';
  errorMessage = '*Incorrect Domain Name/Password';
  login = true;
  loginForm = new FormGroup ({
    domainName: new FormControl(''),
    domainPass: new FormControl(''),
  });
  constructor(
    private formBuilder:FormBuilder,
    private router:Router,
    ) {
    this.createForm();
   }

  ngOnInit(): void {
  }
  createForm(){
    this.loginForm = this.formBuilder.group({
      domainName: ['',[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
      domainPass: ['',[Validators.required]]
    });
  }

  onSubmit(){
    console.table(this.loginForm.value);
    //if username && password not found then... 
    //this.login = false;
    //else
    this.router.navigateByUrl('/home');
    //this.headerCom.show = true;
  }

}
