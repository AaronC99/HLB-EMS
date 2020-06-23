import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Holiday } from 'src/app/model/Holiday.model';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Department } from 'src/app/model/Department.model';
import { Schedule } from 'src/app/model/Schedule.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private REST_API_SERVER = environment.rest_api_url;
  private _holidayToEdit: BehaviorSubject<Holiday>;
  private _deptToEdit: BehaviorSubject<Department>;
  private _skdToEdit: BehaviorSubject<Schedule>;

  constructor(
    private httpClient:HttpClient,
    private _snackBar: MatSnackBar
  ) 
  {
    this._holidayToEdit = new BehaviorSubject(new Holiday());
    this._holidayToEdit.next(new Holiday());
    this._deptToEdit = new BehaviorSubject(new Department());
    this._deptToEdit.next(new Department());
    this._skdToEdit = new BehaviorSubject(new Schedule());
    this._skdToEdit.next(new Schedule());
  }

  set setHolidayToEdit(holiday){
    this._holidayToEdit.next(holiday);
  }

  public getHolidayForEdit(){
    return this._holidayToEdit.asObservable();
  }

  public setDeptToEdit(department){
    this._deptToEdit.next(department);
  }

  public getDeptForEdit(){
    return this._deptToEdit.asObservable();
  }

  public setSkdToEdit(schedule){
    this._skdToEdit.next(schedule);
  }

  public getSkdForEdit(){
    return this._skdToEdit.asObservable();
  }

  // Holiday API
  public editHoliday(editedHoliday){
    this.httpClient.patch(`${this.REST_API_SERVER}/holiday/updateHoliday`,editedHoliday)
    .subscribe( result =>{
      if (result !== null)
        this.displayMessage(`Holiday \'${result['holiday_name']}\'Edited Successfully`,'success');
    });;
  }

  public deleteHoliday(holidayId){
    return this.httpClient.delete(`${this.REST_API_SERVER}/holiday/deleteHoliday/${holidayId}`);
  }

  //Department API 
  public createDepartment(department){
    this.httpClient.post(`${this.REST_API_SERVER}/department/createDepartment`,department)
    .subscribe((res:Department) => {
      if(res !== null)
        this.displayMessage(`${res.department_name} Department Created Successfully`,'success');
    },err => {
        this.displayMessage(`Failed to Create Department`,'failure');
    });
  }

  public editDepartment(editedDept){
   this.httpClient.patch(`${this.REST_API_SERVER}/department/editDepartment`,editedDept)
    .subscribe((res:Department) => {
      if (res !== null)
        this.displayMessage(`${res.department_name} Edited Successfully`,'success');
      else 
        this.displayMessage(`${res.department_name} Edited Unsuccessful`,'failure');

      if (res['activated'])
        this.displayMessage(`${res.department_name} Reactivated Successfully`,'success');
      else  
        this.displayMessage(`${res.department_name} Deactivated Successfully`,'success');
      
    },err => {
      this.displayMessage('Fail to Edit Department','failure');
    });
  }

  // Schedule API
  public createSchedule(newSchedule){
    this.httpClient.post(`${this.REST_API_SERVER}/schedule/createSchedule`,newSchedule)
    .subscribe((res:Schedule) => {
      if (res !== null)
        this.displayMessage(`${res.schedule_name} Created Successfully`,'success');
    },err => {
      this.displayMessage('Fail to Create Schedule','failure');
    });
  }

  public editSchedule(editedSchedule){
    this.httpClient.patch(`${this.REST_API_SERVER}/schedule/editSchedule`,editedSchedule)
    .subscribe((res:Schedule) =>{
      if (res !== null)
        this.displayMessage(`${res.schedule_name} Updated Successfully`,'success');
      else 
        this.displayMessage('Schedule Updated Unsuccessful','failure');

      if (res['activated'])
        this.displayMessage(`${res.schedule_name} Reactivated Successfully`,'success');
      else  
        this.displayMessage(`${res.schedule_name} Deactivated Successfully`,'success');
    },err => {
      this.displayMessage('Failed to Update Schedule','failure');
    });
  }

  public displayMessage(message:string,status:string){
    this._snackBar.open(message,'Close',{
      duration: 5000,
      panelClass: `notif-${status}`
    });
  }
}