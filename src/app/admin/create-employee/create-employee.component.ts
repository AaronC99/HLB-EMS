import { Component, AfterContentInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AdminService } from '../service/admin.service';
import { Employee } from 'src/app/model/Employee.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements AfterContentInit {
  title = 'Create New Employee';
  buttonTitle = 'Register';
  completeMessage = '';
  gender:string[] = ['Male','Female'];
  role:string[] = ['Admin','Manager','Staff'];
  exist = true;
  isEditting = false;
  employee: Employee;
  editable: boolean = true;
  complete:boolean = false;
  showDptDetails = false;
  showSchDetails = false;
  scheduleDetails: Object;
  working_days: Array<string>;
  start_time: string;
  end_time: string;
  departmentDetails: Object;
  dpt_level: string;
  dpt_head: any;
  employeeFormGroup = new FormGroup({
    name: new FormControl(''),
    domainId: new FormControl(''),
    ic_passportNo: new FormControl(''),
    email: new FormControl(''),
    gender: new FormControl(''),
    role: new FormControl(''),
    address: new FormControl(''),
    department: new FormControl(''),
    schedule: new FormControl(''),
    annual_leave : new FormControl(''),
    medical_leave: new FormControl('')
  });
  
  get formArray(): AbstractControl | null { 
    return this.employeeFormGroup.get('formArray'); 
  }
  
  constructor(
    private formBuilder:FormBuilder,
    private adminService: AdminService,
    private router:Router
    ) {
    this.employee = new Employee();
    this.getDepartments();
    this.getSchedules();
  }

  ngAfterContentInit(): void {
    this.checkUserForEdit();
  }

  //get department detials from API
  public getDepartments(){
    this.adminService.getAllDepartments().subscribe(dptDetails => {
      this.departmentDetails = dptDetails;
    });
  }

  //display department details when department name is selected
  public displayDptDetails(dept){
    this.showDptDetails = true;
    this.dpt_level = dept.level;
    this.dpt_head = dept.department_head;
  }

  //display schedule details when schedule name is selected
  public displaySchDetails(schedule){
    this.showSchDetails = true;
    this.working_days = schedule.days_of_work;
    this.start_time = schedule.start_time;
    this.end_time = schedule.end_time;
  }

  //get schedule detials from API
  public getSchedules(){
    this.adminService.getAllSchedules().subscribe(schDetails => {
      this.scheduleDetails = schDetails;
    });
  }

  public createForm(){
    this.employeeFormGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          name: ['',[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
          domainId: ['',[Validators.required,Validators.pattern('[a-zA-Z ]*')],this.isDuplicate.bind(this)],
          ic_passportNo: ['',[Validators.required],this.isDuplicate.bind(this)],
          email: ['',[Validators.required,Validators.email],this.isDuplicate.bind(this)],
          address: ['',Validators.required],
          gender:['',Validators.required],
          role:['',Validators.required]
        }),
        this.formBuilder.group({
          department: [ '', Validators.required]
        }),
        this.formBuilder.group({
          schedule: ['',Validators.required],
          annual_leave:['',Validators.required],
          medical_leave: ['',Validators.required]
        })
      ])
    });
  }

  public editForm() {
    this.employeeFormGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          name: [this.employee.name,[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
          domainId: [this.employee.domain_id,[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
          ic_passportNo: [this.employee.ic,[Validators.required]],
          email: [this.employee.email,[Validators.required,Validators.email]],
          address: [this.employee.address,Validators.required],
          gender: [this.employee.gender,Validators.required],
          role: [this.employee.role,Validators.required]
        }),
        this.formBuilder.group({
          department: [ this.employee.department._id, Validators.required]
        }),
        this.formBuilder.group({
          schedule: [ this.employee.schedule._id, Validators.required],
          annual_leave: [this.employee.annual_leave,Validators.required],
          medical_leave: [this.employee.medical_leave,Validators.required]
        })
      ])
    });
  }

  public onSubmit(){
    this.editable = false;
    this.complete = true;
    this.employee = {
      domain_id: this.formArray.value[0].domainId,
      name: this.formArray.value[0].name,
      gender: this.formArray.value[0].gender,
      address: this.formArray.value[0].address,
      ic: this.formArray.value[0].ic_passportNo,
      email: this.formArray.value[0].email,
      department: this.formArray.value[1].department,
      schedule: this.formArray.value[2].schedule,
      role: this.formArray.value[0].role,
      annual_leave:this.formArray.value[2].annual_leave,
      medical_leave:this.formArray.value[2].medical_leave
    }
    if (this.isEditting === false){
      this.completeMessage = 'A new employee has been registered.';
      this.adminService.addEmployee(this.employee);
    } else {
      this.adminService.updateEmployee(this.employee.domain_id,this.employee).subscribe(data => {
        if(data !== null)
          this.completeMessage = `${this.employee.name} record have been updated.`;
      },err => {
        console.log(err);
        this.completeMessage = `Fail to Update ${this.employee.name} record.`;
      });
      this.isEditting = false;
    }
  }

  public showErrorMessage(){
    return 'Invalid Input';
  }

  public isDuplicate(control: AbstractControl) {
    return this.adminService.checkDuplicate(control.value).pipe(map(res =>{
      return res !== null ? { duplicate: true} : null;
    }));
  }

  public checkUserForEdit(){
    this.adminService.getCurrUserToEdit().subscribe(data => {

      if (data === null){
        this.createForm();
      } else {
        this.isEditting = true;
        this.employee = data;
        this.title = `Edit Profile Details: ${this.employee.name}`;
        this.buttonTitle = 'Update Details';
        this.editForm();
      }
    });
  }
}
