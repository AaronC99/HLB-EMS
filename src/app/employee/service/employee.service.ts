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

  public getProfile(domainId:string){
    return this.httpClient.get(`${this.REST_API_SERVER}/profile/${domainId}`);
  }

  public getAllEmployees(DomainID:String){
    return this.httpClient.get(this.REST_API_SERVER+'/employee/allEmployees/'+DomainID);
  }

  public clockIn(domainId:string){
    return this.httpClient.patch(`${this.REST_API_SERVER}/clock/clockIn`
      ,{
        "domain_id":domainId
      });
  }

  public clockOut(domainId:string,dateIn:string,year:string){
    return this.httpClient.patch(`${this.REST_API_SERVER}/clock/clockOut`
    ,{
      "domain_id":domainId,
      "date_in":dateIn,
      "year":year
    });
  }

  public getTimesheet(domainId:string,month:string,year:string){
    return this.httpClient.get(`${this.REST_API_SERVER}/timesheet/viewTimesheet/${domainId}/${month}/${year}`);
  }

  public getAvailableTimesheet(domainId:string){
    return this.httpClient.get(`${this.REST_API_SERVER}/timesheet/availableTimesheet/${domainId}`);
  }

  public sendEmail(domainId:string,period:string,year:string,status:string){
    return this.httpClient.post(`${this.REST_API_SERVER}/timesheet/sendEmail`
    ,{
      "domain_id":domainId,
      "period":period,
      "year":year,
      "type":status
    });
  }

  //Pass back Approved/Rejected status
  public updateTimesheetStatus(domainId:string,period:string,year:string,status:string){ 
    return this.httpClient.patch(`${this.REST_API_SERVER}/timesheet/updateTimesheetStatus/${domainId}/${period}/${year}`
    ,{
      "approval_status":status
    });
  }

  public allowTimesheetEdit(recordsForEdit){
    return this.httpClient.patch(`${this.REST_API_SERVER}/timesheet/setEditableTimesheet` ,recordsForEdit);
  }

  // for date out, let them select current day or next day
  // if date out and date in same,  send back null for date out 
  // time out cannot be earlier than time in unless is next day
  // after request, send email : staus = 'Reapproval';
  public editTimesheet(editedArray){
    return this.httpClient.patch(`${this.REST_API_SERVER}/timesheet/editTimesheet`,editedArray);
  }
}
