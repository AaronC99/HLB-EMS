import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Holiday } from 'src/app/model/Holiday.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private REST_API_SERVER = "http://localhost:3000";
  private _holidayToEdit: BehaviorSubject<Holiday>;

  constructor(
    private httpClient:HttpClient
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

  public editHoliday(editedHoliday){
    return this.httpClient.patch(`${this.REST_API_SERVER}/holiday/updateHoliday`,editedHoliday);
  }

}
