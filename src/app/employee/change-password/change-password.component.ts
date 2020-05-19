import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  newPwdForm:FormGroup;
  errorMatcher = new CrossFieldErrorMatcher();
  constructor(
    private formBuilder: FormBuilder
  ) {
    
   }

  ngOnInit(): void {
    this.createForm();
  }

  get userInput(){
    return this.newPwdForm.controls;
  }

  createForm(){
    this.newPwdForm = this.formBuilder.group({
      oldPwd : ['',[Validators.required,Validators.minLength(6)]],
      newPwd : ['',[Validators.required,Validators.minLength(6)]],
      confirmPwd : ['',[Validators.required,Validators.minLength(6)]]
    },{
      validators: this.passwordValidator
    });
  }

  passwordValidator(form: FormGroup) {
    if (form.get('newPwd').value !== form.get('confirmPwd').value && form.get('oldPwd').value !== form.get('newPwd').value){
      return { passwordsDoNotMatch: true };
    } else if(form.get('oldPwd').value === form.get('newPwd').value){
      return { passwordsMatch: true };
    } else {
      return null;
    }
  }
}
