import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { AdminService } from '../service/admin.service';
import { Employee } from 'src/app/model/Employee.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  title = 'Create New Employee';
  buttonTitle = 'Register';
  completeMessage = 'A new employee has been registered.';
  gender:string[] = ['Male','Female'];
  role:string[] = ['Admin','Manager','Staff'];
  exist = true;
  isEditting = false;
  employee:Employee;
  editable: boolean = true;
  showDptDetails = false;
  showSchDetails = false;
  scheduleDetails:any;
  working_days:any;
  start_time:any;
  end_time:any;
  departmentDetails:any;
  dpt_level:any;
  dpt_head:any;
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
  });
  get formArray(): AbstractControl | null { return this.employeeFormGroup.get('formArray'); }
  
  constructor(
    private formBuilder:FormBuilder,
    private adminService: AdminService
    ) {
    this.employee = new Employee();
    this.getDepartments();
    this.getSchedules();
    this.checkUserForEdit();
  }

  ngOnInit(): void {
    
  }

  //get department detials from API
  public getDepartments(){
    this.adminService.getAllDepartments().subscribe(dptDetails =>{
      this.departmentDetails = dptDetails;
    });
  }

  //display department details when schedule name is selected
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
          department: ['',Validators.required]
        }),
        this.formBuilder.group({
          schedule: ['',Validators.required]
        })
      ])
    });
  }

  public editForm(){
    this.employeeFormGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          name: [this.employee.name,[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
          domainId: [this.employee.domain_id,[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
          ic_passportNo: [this.employee.ic,[Validators.required]],
          email: [this.employee.email,[Validators.required,Validators.email]],
          address: [this.employee.address,Validators.required],
          gender:[this.employee.gender,Validators.required],
          role:[this.employee.role,Validators.required],
        }),
        this.formBuilder.group({
          department: [this.employee.department.department_name,Validators.required]
        }),
        this.formBuilder.group({
          schedule: [this.employee.schedule.schedule_name,Validators.required]
        })
      ])
    });
  }

  public onSubmit(){
    this.editable = false;
    this.employee = {
      domain_id: this.formArray.value[0].domainId,
      name: this.formArray.value[0].name,
      gender:this.formArray.value[0].gender,
      address:this.formArray.value[0].address,
      ic: this.formArray.value[0].ic_passportNo,
      email:this.formArray.value[0].email,
      department: this.formArray.value[1].department._id,
      schedule:this.formArray.value[2].schedule._id,
      role: this.formArray.value[0].role
    }
    console.log(this.employee);
    if (this.isEditting === false)
      this.adminService.addEmployee(this.employee);
    else {
      this.adminService.updateEmployee(this.employee.domain_id,this.employee);
      this.isEditting = false;
    }
      
  }

  showErrorMessage(){
    return 'Invalid Input';
  }

  public isDuplicate(control:AbstractControl) {
    return this.adminService.checkDuplicate(control.value).pipe(map(res =>{
      return res !== null ? { duplicate:true}: null;
    }));
  }

  public checkUserForEdit(){
    this.adminService.getCurrUserToEdit().subscribe(data =>{
      if (data === null){
        this.createForm();
      }else{
        this.isEditting = true;
        this.employee = data;
        this.title = `Edit Profile Details: ${this.employee.name}`;
        this.buttonTitle = 'Update Details';
        this.completeMessage = `${this.employee.name} record have been updated.`;
        this.editForm();
      }
    });
  }
}
