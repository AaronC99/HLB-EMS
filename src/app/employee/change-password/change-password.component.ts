import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { EmployeeService } from '../service/employee.service';
import { AuthModel } from 'src/app/model/Authentication.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  currentPassword:any;
  currentUser: AuthModel;
  newPwdForm:FormGroup;
  errorMatcher = new MyErrorStateMatcher();
  hide = true;
  passwordError = null;

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser.username !== this.route.snapshot.paramMap.get('employeeId')){
      this.authService.logout();
      this.router.navigateByUrl('login-page');
    }
   }

  ngOnInit(): void {
    this.createForm();
  }

  get newPassword(){
    return this.newPwdForm.get('newPwd');
  }

  get oldPassword(){
    return this.newPwdForm.get('oldPwd');
  }

  get confirmPassword(){
    return this.newPwdForm.get('confirmPwd');
  }

  createForm(){
    this.newPwdForm = this.formBuilder.group({
      oldPwd : ['',Validators.required],
      newPwd : ['',[Validators.required,Validators.minLength(8),Validators.maxLength(20)]],
      confirmPwd : ['']
    },{
      validators: this.passwordValidator
    });
  }

  public passwordValidator(form: FormGroup) {
     if (form.get('newPwd').value === form.get('oldPwd').value){
      return { oldPasswordMatch: true };
    } else if(form.get('confirmPwd').value !== form.get('newPwd').value){
      return { passwordsDoNotMatch: true };
    } else {
      return null;
    }
  }

  public getErrorMessage(){
    if (this.oldPassword.errors?.required || this.newPassword.errors?.required)
      return 'Password Required'; 
    else if (this.newPassword.errors?.minlength)
      return 'Password Too Short. Must be at least 8 characters.';
    else if (this.newPassword.errors?.maxlength)
      return 'Password Too Long. Cannot Exceed 20 characters.';
  }

  onSubmit(){
    let newPassword = {
      domain_id: this.currentUser.username,
      password: this.oldPassword.value,
      newpass: this.newPassword.value,
      connewpass: this.confirmPassword.value
    }; 
    this.employeeService.setNewPassword(newPassword).subscribe (res => {
      let success = res['success'];
      let error = res['error'];
      if (success !== undefined){
        this.employeeService.displayMessage(success,'success');
        this.authService.logout();
        this.router.navigateByUrl('login-page');
        this.passwordError = null;
      } else if (error !== undefined){
        this.passwordError = error;
      }
    });
    this.newPwdForm.reset();
  }
}
