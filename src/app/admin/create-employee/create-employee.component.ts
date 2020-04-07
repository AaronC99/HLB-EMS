import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AdminService } from '../service/admin.service';
import { Employee } from 'src/app/model/Employee.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  gender:string[]=['Male','Female'];
  role:string[]=['Admin','Staff'];
  exist = true;
  employee:Employee;
  editable: boolean = true;
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
    this.checkDuplicateValues(this.formArray.value);
  }

  ngOnInit(): void {
  }

  public getDepartments(){//get department detials from API
    this.adminService.getAllDepartments().subscribe(dptDetails =>{
      this.dpt_name = dptDetails;
    });
  }
  public displayDptDetails(data){//display department details when schedule name is selected
    this.showDptDetails = true;
    this.dpt_level = data.level;
    this.dpt_head = data.department_head;
  }

  public displaySchDetails(data){//display schedule details when schedule name is selected
    this.showSchDetails = true;
    this.working_days = data.days_of_work;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
  }

  public getSchedules(){//get schedule detials from API
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
    this.editable = false;
    this.employee = this.formArray.value;
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
    this.adminService.addEmployee(this.employee);
  }
  showErrorMessage(){
    if (this.formArray.hasError('required'))
      return 'Field is required!!';
    // else if (this.formArray.hasError('duplicate'))
    //   return 'Already Exist!!';
    else
      return 'Field does not contain numeric values';
  }

  public checkDuplicateValues(input:any){
    this.adminService.checkDuplicate(input)
      .subscribe((result)=>{
      if (result !== null){
        console.log("ID Exist");
        this.exist = true;
      } else 
        this.exist = false;
    });
  }
}
