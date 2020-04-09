import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  public _isExist = new BehaviorSubject<boolean>(false);
  private REST_API_SERVER = "http://localhost:3000";
  constructor(
    private httpClient: HttpClient
  ) { }
  
  get isExist(){
    return this._isExist.asObservable();
  }
  public getAllDepartments(){
    return this.httpClient.get(this.REST_API_SERVER+'/department/alldepartments');
  }

  public getAllSchedules(){
    return this.httpClient.get(this.REST_API_SERVER+'/schedule/allschedules');
  }
  
  public addEmployee(employeeDetails:any){ //pass in the employee object
    this.httpClient.post(this.REST_API_SERVER+'/employee/addEmployee',employeeDetails);
  }

  public checkDuplicate(userInput:string){
    return this.httpClient.get(this.REST_API_SERVER+'/employee/checkduplicate/'+userInput)
      .subscribe(results=>{
        if (results !== null)
          this._isExist.next(true);
        else 
          this._isExist.next(false);
      });
  }

  public updateEmployee(SelectedEmpID: string, updateDetails:any){
    this.httpClient.patch(this.REST_API_SERVER+'/employee/updateEmployee/'+SelectedEmpID, updateDetails);
  }
}
