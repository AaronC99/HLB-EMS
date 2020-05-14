import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Holiday } from 'src/app/model/Holiday.model';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private _holidayToEdit: BehaviorSubject<Holiday>;

  constructor() {
    this._holidayToEdit = new BehaviorSubject(new Holiday());
    this._holidayToEdit.next(new Holiday());
   }

   public setHolidayToEdit(holiday){
    this._holidayToEdit.next(holiday);
   }

   public getHolidayForEdit(){
    return this._holidayToEdit.asObservable();
   }
}
