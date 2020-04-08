import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private REST_API_SERVER = "http://localhost:3000";
  constructor(
    private httpClient: HttpClient
  ) { }

  public getAllDepartments(){
    return this.httpClient.get(this.REST_API_SERVER+'/department/alldepartments');
  }

  public getAllSchedules(){
    return this.httpClient.get(this.REST_API_SERVER+'/schedule/allschedules');
  }
  
  public addEmployee(employeeDetails:any){ //pass in the employee object
    this.httpClient.post(this.REST_API_SERVER+'/employee/addEmployee',employeeDetails).subscribe((data)=>{
      console.log(data);
    });
  }

  public checkDuplicate(userInput:string){
    return this.httpClient.get(this.REST_API_SERVER+'/employee/checkduplicate/'+userInput);
  }

  public updateEmployee(SelectedEmpID: string, updateDetails:any){
    this.httpClient.patch(this.REST_API_SERVER+'/employee/updateEmployee/'+SelectedEmpID, updateDetails).subscribe((data:any)=>{
      console.log(data);
    });
  }
}
