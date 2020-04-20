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

  public clockIn(domainId:string,dateIn:string,timeIn:string,year:string){
    return this.httpClient.get(`${this.REST_API_SERVER}/clock/clockIn/${domainId}/${dateIn}/${timeIn}/${year}`);
  }

  public clockOut(domainId:string,dateIn:string,dateOut:string,timeOut:string,year:string){
    return this.httpClient.get(`${this.REST_API_SERVER}/clock/clockOut/${domainId}/${dateIn}/${dateOut}/${timeOut}/${year}`);
  }

  public getCurrUserClockInOut(domainId:string,month:string,year:string){
    return this.httpClient.get(`${this.REST_API_SERVER}/timesheet/viewTimesheet/${domainId}/${month}/${year}`);
  }

  public getAllYear(domainId:string){
    return this.httpClient.get(`${this.REST_API_SERVER}/timesheet/availableTimesheet/${domainId}`);
  }

  public requestApproval(domainId:string,period:string,year:string){
    return this.httpClient.get(`${this.REST_API_SERVER}/timesheet/approvalEmail/${domainId}/${period}/${year}`);
  }

}
