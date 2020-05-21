import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Employee } from 'src/app/model/Employee.model';
import { MaintenanceService } from '../service/maintenance.service';
import { AdminService } from 'src/app/admin/service/admin.service';
import { EmployeeService } from 'src/app/employee/service/employee.service';
import { AuthModel } from 'src/app/model/Authentication.model';
import { Department } from 'src/app/model/Department.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.scss']
})
export class CreateDepartmentComponent implements OnInit {
  newDeptForm: FormGroup;
  maxLength = 3;
  allManagers: Employee[] = [];
  allDept: Department[] = [];
  currentUser:AuthModel;
  _deptObj:Department;
  manager: Employee;

  constructor(
    private formBuilder: FormBuilder,
    private maintainService: MaintenanceService,
    private adminService: AdminService,
    private employeeService: EmployeeService,
    private router:Router
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
   }

  ngOnInit(): void {
    this.createForm();
    this.getAllDepartments();
    this.getAllManagers();
  }

  public createForm(){
    this.newDeptForm = this.formBuilder.group({
      deptName: ['',Validators.required],
      deptHead: ['',Validators.required],
      level: ['',[Validators.required,Validators.maxLength(this.maxLength)]]
    });
  }

  public getAllManagers(){
    this.employeeService.getAllEmployees(this.currentUser.username).subscribe((data:Employee[]) => {
      let employees:any = data;
      this.allManagers = employees.filter( user => user.role === 'Manager');
      console.log(this.allManagers);
    });
  }

  public getAllDepartments(){
    this.adminService.getAllDepartments().subscribe ((data:Department[]) =>{
      this.allDept = data;
    });
  }

  get deptName(){
    return this.newDeptForm.get('deptName');
  }

  get deptHead(){
    return this.newDeptForm.get('deptHead');
  }

  get level(){
    return this.newDeptForm.get('level');
  }

  public validateDept(){
    for (let i=0;i<this.allDept.length;i++){
      if (this.deptName.value === this.allDept[i].department_name){
        this.deptName.setErrors({ 'isDuplicate':true });
        break;
      }
    }
  }

  public onSubmit(){
    let deptObj = {
      department_name: this.deptName.value,
      department_head: this.deptHead.value,
      level: this.level.value
    };
    //this.maintainService.createDepartment(deptObj);
    this.router.navigateByUrl('/home/all-departments');
    this.newDeptForm.reset();
  }

  public getErrorMessage(){
    if (this.level.errors?.maxlength)
      return 'Maximum length is 3 characters';
    else if (this.deptName.hasError('isDuplicate'))
      return 'Department Already Exist'
    else 
      return 'Field Is Required';
  }

}
