import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AdminService } from 'src/app/admin/service/admin.service';
import { Schedule } from 'src/app/model/Schedule.model';
import { MaintenanceService } from '../service/maintenance.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrls: ['./create-schedule.component.scss']
})

export class CreateScheduleComponent implements OnInit {
  newSchedule = true;
  newSkdForm:FormGroup;
  schedule:Schedule;
  daysInWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  selectedDays = null;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private maintainService: MaintenanceService,
    private  router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  public createForm(){
    this.newSkdForm = this.formBuilder.group({
      skdName: ['',Validators.required],
      daysOfWork: new FormControl([]),
      startTime: ['',[Validators.required,Validators.maxLength(4), Validators.pattern("^[0-9]*$")]],
      endTime: ['',[Validators.required,Validators.maxLength(4), Validators.pattern("^[0-9]*$")]],
    });
  }


  get scheduleName (){
    return this.newSkdForm.get('skdName');
  }

  get daysOfWork (){
    return this.newSkdForm.get('daysOfWork');
  }

  get startTime(){
    return this.newSkdForm.get('startTime');
  }

  get endTime(){
    return this.newSkdForm.get('endTime');
  }


  public onSubmit(){
    if (this.daysOfWork.value.length === 0){
      this.selectedDays = false;
    }else {
      this.selectedDays = true;
      this.schedule = {
        _id:null,
        schedule_name: this.scheduleName.value,
        days_of_work: this.daysOfWork.value,
        start_time: this.startTime.value,
        end_time: this.endTime.value
      }
      this.maintainService.createSchedule(this.schedule);
      this.router.navigateByUrl('/home/all-schedules');
    }
  }

  public validateSkd(){
    this.adminService.getAllSchedules().subscribe((data:Schedule[]) => {
      for (let i=0;i<data.length;i++){
        if (this.scheduleName.value === data[i].schedule_name){
          this.scheduleName.setErrors({'isExisting' : true});
          break;
        }
      }
    });
  }

  public getErrorMessage(){
    if (this.startTime.errors?.maxlength || this.endTime.errors?.maxlength)
      return 'Maximum length is 4 characters';
    else if (this.startTime.errors?.pattern || this.endTime.errors?.pattern)
      return 'Enter Numeric Values Only';
    else if (this.scheduleName.hasError('isExisting'))
      return 'Schedule Already Exist'
    else 
      return 'Field Is Required';
  }
}