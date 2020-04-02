import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private REST_API_SERVER = "http://localhost:3000";

  constructor(
    private httpClient: HttpClient
  ) { }

  public getProfileDetails(ProfileID:string){
    return this.httpClient.get(this.REST_API_SERVER+'/profile/'+ProfileID);
  }

  public getAllEmployees(DomainID:string){ //pass in the id of current user to check if its admin or manager
    return this.httpClient.get(this.REST_API_SERVER+'/allEmployees/'+DomainID);
  }

  public addEmployee(employeeDetails:any){ //pass in the employee object
    this.httpClient.post(this.REST_API_SERVER+'/addEmployee',employeeDetails).subscribe((data)=>{
      console.log(data);
    });
  }

  public updateEmployee(SelectedEmpID: string, updateDetails:any){
    this.httpClient.patch(this.REST_API_SERVER+'/updateEmployee/'+SelectedEmpID, updateDetails).subscribe((data:any)=>{
      console.log(data);
    });
  }
}
