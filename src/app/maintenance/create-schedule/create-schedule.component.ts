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
  hours = [];
  minutes = [];

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
    for (let h = 0; h <= 23; h++){
      let hrs = ("0" + h).slice(-2);
      this.hours.push(hrs);
    }
    for (let m = 0; m < 60; m++){
      let mins =  ("0" + m).slice(-2);
      this.minutes.push(mins);
    }
    this.newSkdForm = this.formBuilder.group({
      skdName: ['',Validators.required],
      daysOfWork: new FormControl([]),
      startHour: ['',[Validators.required]],
      startMin: ['',[Validators.required]],
      endHour: ['',[Validators.required]],
      endMin: ['',[Validators.required]]
    });
  }


  get scheduleName (){
    return this.newSkdForm.get('skdName');
  }

  get daysOfWork (){
    return this.newSkdForm.get('daysOfWork');
  }

  get startTime(){
    let start_time = `${this.newSkdForm.get('startHour').value}${this.newSkdForm.get('startMin').value}`;
    return start_time;
  }

  get endTime(){
    let end_time = `${this.newSkdForm.get('endHour').value}${this.newSkdForm.get('endMin').value}`;
    return end_time;
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
          start_time: this.startTime,
          end_time: this.endTime
        }
        this.maintainService.createSchedule(this.schedule);
      } else {
        let editedSkd:Schedule = {
          _id: this.schedule._id,
          schedule_name: this.scheduleName.value,
          days_of_work: this.daysOfWork.value,
          start_time: this.startTime,
          end_time: this.endTime
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
    if (this.scheduleName.hasError('isExisting'))
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
        let start_hour = this.schedule.start_time.substring(0,2);
        let start_min = this.schedule.start_time.substring(2,4);
        let end_hour = this.schedule.end_time.substring(0,2);
        let end_min = this.schedule.end_time.substring(2,4);
        this.newSkdForm.patchValue({
          skdName: this.schedule.schedule_name,
          daysOfWork: this.schedule.days_of_work,
          startHour: start_hour,
          startMin: start_min,
          endHour: end_hour,
          endMin: end_min
        });
      }
    });
  }
}