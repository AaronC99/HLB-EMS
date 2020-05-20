import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { EmployeeService } from '../service/employee.service';
import { AuthModel } from 'src/app/model/Authentication.model';
import { Md5 } from 'ts-md5/dist/md5';

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
  md5 = new Md5();
  incorrectPwd:boolean;
  isValid:boolean = false;
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.employeeService.getProfile(this.currentUser.username).subscribe(data =>{
      this.currentPassword = data['password'];
    });
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
      oldPwd : ['',[Validators.required,Validators.minLength(6),Validators.maxLength(20)]],
      newPwd : ['',[Validators.required,Validators.minLength(6),Validators.maxLength(20)]],
      confirmPwd : ['']
    },{
      validators: this.passwordValidator
    });
  }

  // public incorrectPwd(control: AbstractControl){
  //   return this.employeeService.getProfile(this.currentUser.username).pipe(map(res=>{
  //     this.currentPassword = res['password'];
  //     console.log(control.value)
  //     let hashedPwd = this.md5.appendStr(control.value).end();
  //   }));
  // }

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
    else if (this.oldPassword.errors?.minlength || this.newPassword.errors?.minlength)
      return 'Password Too Short. Must be at least 6 characters.';
    else if (this.oldPassword.errors?.maxlength || this.newPassword.errors?.maxlength)
      return 'Password Too Long. Cannot Exceed 20 characters.';
  }

  onSubmit(){
    let hashedPwd = this.md5.appendStr(this.oldPassword.value).end();
 
    // Check if current password is correct
    if (hashedPwd === this.currentPassword){
      let newhashedPwd = this.md5.appendStr(this.confirmPassword.value).end();
      let newPassword = {
        domain_id: this.currentUser.username,
        password: newhashedPwd
      }; 
      console.log(newPassword);
    } else {
      this.incorrectPwd = true;
    }
    
    
  }
}
