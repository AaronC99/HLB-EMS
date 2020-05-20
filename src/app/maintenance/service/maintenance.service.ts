import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Holiday } from 'src/app/model/Holiday.model';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private REST_API_SERVER = "http://localhost:3000";
  private _holidayToEdit: BehaviorSubject<Holiday>;

  constructor(
    private httpClient:HttpClient,
    private _snackBar: MatSnackBar
  ) 
  {
    this._holidayToEdit = new BehaviorSubject(new Holiday());
    this._holidayToEdit.next(new Holiday());
  }

  set setHolidayToEdit(holiday){
    this._holidayToEdit.next(holiday);
  }

  public getHolidayForEdit(){
    return this._holidayToEdit.asObservable();
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
    return this.httpClient.post(`${this.REST_API_SERVER}/department/createDepartment`,department);
  }

  public displayMessage(message:string,status:string){
    this._snackBar.open(message,'Close',{
      duration: 5000,
      panelClass: `notif-${status}`
    });
  }
}