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

  public getAllEmployees(DomainID:string){
    return this.httpClient.get(this.REST_API_SERVER+'/allEmployees/'+DomainID);
  }

  
}
