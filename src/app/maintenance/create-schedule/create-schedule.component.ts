import { Component, OnInit, AfterViewInit } from '@angular/core';
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

export class CreateScheduleComponent implements OnInit,AfterViewInit {
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

  ngAfterViewInit(){
    this.checkSkdForEdit();
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
      if (this.newSchedule){
        this.schedule = {
          _id:null,
          schedule_name: this.scheduleName.value,
          days_of_work: this.daysOfWork.value,
          start_time: this.startTime.value,
          end_time: this.endTime.value
        }
        this.maintainService.createSchedule(this.schedule);
      } else {
        let editedSkd:Schedule = {
          _id: this.schedule._id,
          schedule_name: this.scheduleName.value,
          days_of_work: this.daysOfWork.value,
          start_time: this.startTime.value,
          end_time: this.endTime.value
        };
        this.maintainService.editSchedule(editedSkd);
      }
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

  public checkSkdForEdit(){
    this.maintainService.getSkdForEdit().subscribe((data:Schedule) => {
      if (Object.keys(data).length === 0){
        this.newSchedule = true;
        this.maintainService.setSkdToEdit(null);
        this.router.navigateByUrl('/home/new-schedule');
      }else {
        this.schedule = data;
        this.newSchedule = false;
        this.newSkdForm.patchValue({
          skdName: this.schedule.schedule_name,
          daysOfWork: this.schedule.days_of_work,
          startTime: this.schedule.start_time,
          endTime: this.schedule.end_time
        });
      }
    });
  }
}