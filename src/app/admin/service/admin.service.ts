import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Employee } from 'src/app/model/Employee.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private REST_API_SERVER = "http://localhost:3000";
  private _userToEdit: BehaviorSubject<Employee>;

  constructor(
    private httpClient: HttpClient
  ) {
    this._userToEdit = new BehaviorSubject(new Employee());
    this._userToEdit.next(new Employee());
  }


  set userToEdit(user) {
    console.log(user);
    this._userToEdit.next(user);
  }

  public getCurrUserToEdit(){
    return this._userToEdit.asObservable();
  }

  public getAllDepartments(){
    return this.httpClient.get(this.REST_API_SERVER+'/department/alldepartments');
  }

  public getAllSchedules(){
    return this.httpClient.get(this.REST_API_SERVER+'/schedule/allschedules');
  }

  public addEmployee(employeeDetails:any){
    this.httpClient.post(this.REST_API_SERVER+'/employee/addEmployee',employeeDetails).subscribe(data=>{
      console.log(data);
    });
  }

  public checkDuplicate(userInput:string){
    return this.httpClient.get(this.REST_API_SERVER+'/employee/checkduplicate/'+userInput);
  }

  public updateEmployee(SelectedEmpID: string, updateDetails:any){
    this.httpClient.patch(this.REST_API_SERVER+'/employee/updateEmployee/'+SelectedEmpID, updateDetails).subscribe(data=>{
      console.log(data);
    });
  }
}
