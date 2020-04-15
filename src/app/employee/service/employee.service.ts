import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from 'src/app/model/Employee.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private REST_API_SERVER = "http://localhost:3000";
  private currUserObj:Employee = new Employee();
  private currUserSubj: BehaviorSubject<Employee>;

  get currUserDetils(){
    return this.currUserSubj.asObservable();
  }
  constructor(
    private httpClient: HttpClient
  ) {
    this.currUserSubj = new BehaviorSubject(this.currUserObj);
    this.currUserSubj.next(this.currUserObj);
   }

  public getProfileDetails(ProfileID:String){
    this.httpClient.get(this.REST_API_SERVER+'/profile/'+ProfileID)
      .subscribe((data) => {
        this.currUserObj = {
          name: data['name'],
          domain_id: data['domain_id'],
          ic: data['ic'],
          address: data['address'],
          gender: data['gender'],
          email: data['email'],
          role: data['role'],
          schedule: data['schedule'],
          department: data['department'] 
        };
        this.currUserSubj.next(this.currUserObj);
      });
  }

  public getAllEmployees(DomainID:String){
    return this.httpClient.get(this.REST_API_SERVER+'/employee/allEmployees/'+DomainID);
  }

}
