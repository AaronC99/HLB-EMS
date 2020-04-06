import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ControlContainer } from '@angular/forms';
import { AdminService } from '../service/admin.service';
import { Employee } from 'src/app/model/Employee.model';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  gender:string[]=['Male','Female'];
  role:string[]=['Admin', 'Manager', 'Staff'];
  employee:Employee;
  showDptDetails = false;
  showSchDetails = false;
  schedule_name:any;
  working_days:any;
  start_time:any;
  end_time:any;
  dpt_name:any;
  dpt_level:any;
  dpt_head:any;
  createEmployeeFormGroup = new FormGroup({
    name: new FormControl(''),
    domainId: new FormControl(''),
    ic_passportNo: new FormControl(''),
    email: new FormControl(''),
    gender: new FormControl(''),
    role: new FormControl(''),
    address: new FormControl(''),
    department: new FormControl(''),
    schedule: new FormControl(''),
  });
  get formArray(): AbstractControl | null { return this.createEmployeeFormGroup.get('formArray'); }
  
  constructor(
    private formBuilder:FormBuilder,
    private adminService: AdminService
    ) {
    this.createForm();
    this.getDepartments();
    this.getSchedules();
  }

  ngOnInit(): void {
  }

  public getDepartments(){
    this.adminService.getAllDepartments().subscribe(dptDetails =>{
      this.dpt_name = dptDetails;
    });
  }
  getDptDetails(data){
    this.showDptDetails = true;
    this.dpt_level = data.level;
    this.dpt_head = data.department_head;
  }

  getSchDetails(data){
    this.showSchDetails = true;
    this.working_days = data.days_of_work;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
  }

  public getSchedules(){
    this.adminService.getAllSchedules().subscribe(schDetails => {
      this.schedule_name = schDetails;
    });
  }

  public createForm(){
    this.createEmployeeFormGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          name: ['',[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
          domainId: ['',[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
          ic_passportNo: ['',Validators.required],
          email: ['',[Validators.required,Validators.email]],
          address: ['',Validators.required],
          gender:['',Validators.required],
          role:['',Validators.required]
        }),
        this.formBuilder.group({
          department: ['',Validators.required]
        }),
        this.formBuilder.group({
          schedule: ['',Validators.required]
        })
      ]),
      
    });
  }

  public onSubmit(){
    this.employee = this.formArray.value;
    this.employee = {
      name: this.formArray.value[0].name,
      domainId: this.formArray.value[0].domainId,
      icNumber: this.formArray.value[0].ic_passportNo,
      address:this.formArray.value[0].address,
      email:this.formArray.value[0].email,
      gender:this.formArray.value[0].gender,
      role: this.formArray.value[0].role,
      department: this.formArray.value[1].department._id,
      schedule:this.formArray.value[2].schedule._id
    }
    console.log(this.employee);
  }
}
