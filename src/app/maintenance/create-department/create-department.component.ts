import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Employee } from 'src/app/model/Employee.model';
import { MaintenanceService } from '../service/maintenance.service';
import { AdminService } from 'src/app/admin/service/admin.service';
import { EmployeeService } from 'src/app/employee/service/employee.service';
import { AuthModel } from 'src/app/model/Authentication.model';
import { Department } from 'src/app/model/Department.model';
import { Router} from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.scss']
})
export class CreateDepartmentComponent implements OnInit,AfterViewInit,OnDestroy {
  newDeptForm: FormGroup;
  maxLength = 3;
  allManagers: Employee[] = [];
  allDept: Department[] = [];
  currentUser:AuthModel;
  _deptObj:Department;
  manager: Employee;
  newDept = true;
  destroy$ : Subject<boolean> = new Subject<boolean>();

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

  ngAfterViewInit(){
    this.checkDeptForEdit();
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public createForm(){
    this.newDeptForm = this.formBuilder.group({
      deptName: ['',Validators.required],
      deptHead: ['',Validators.required],
      level: ['',[Validators.required,Validators.maxLength(this.maxLength)]]
    });
  }

  public getAllManagers(){
    this.employeeService.getAllEmployees(this.currentUser.username)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:Employee[]) => {
      let employees:any = data;
      this.allManagers = employees.filter( user => user.role === 'Manager');
    });
  }

  public getAllDepartments(){
    this.adminService.getAllDepartments()
    .pipe(takeUntil(this.destroy$))
    .subscribe ((data:Department[]) =>{
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
    if (this.newDept){
      let newDeptObj = {
        department_name: this.deptName.value,
        department_head: this.deptHead.value,
        level: this.level.value
      };
      this.maintainService.createDepartment(newDeptObj);
    } else {
      let editedObj:Department = {
        _id: this._deptObj._id,
        department_name: this.deptName.value,
        department_head: this.deptHead.value,
        level: this.level.value
      };
      this.maintainService.editDepartment(editedObj);
    }
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

  public checkDeptForEdit(){
    this.maintainService.getDeptForEdit()
    .pipe(takeUntil(this.destroy$))
    .subscribe((dept:Department) => {
      if (dept.department_name !== undefined){
        this._deptObj = dept;
        this.newDept = false
        this.newDeptForm.patchValue({
          deptName: dept.department_name,
          deptHead: dept.department_head['_id'],
          level: dept.level
        });
      } else {
        this.newDept = true;
        this.maintainService.setDeptToEdit(null);
        this.router.navigateByUrl('/home/new-department');
      }
    });
  }
}