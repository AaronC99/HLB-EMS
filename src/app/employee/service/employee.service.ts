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

  get currUserDetails(){
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
          department: data['department'], 
          annual_leave: data['annual_leave'],
          medical_leave: data['medical_leave']
        };
        this.currUserSubj.next(this.currUserObj);
      });
  }

  public getProfile(domainId){
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

  public clockOut(domainId:string){
    return this.httpClient.patch(`${this.REST_API_SERVER}/clock/clockOut`
    ,{
      "domain_id":domainId
    });
  }

  public getClockInOutStatus(domainId:string){
    return this.httpClient.get(`${this.REST_API_SERVER}/clock/checkClockInStatus/${domainId}`);
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

  public editTimesheet(editedArray){
    return this.httpClient.patch(`${this.REST_API_SERVER}/timesheet/editTimesheet`,editedArray);
  }
  public checkAvailableLeaves(domainID,year,leaveType){
    return this.httpClient.get(`${this.REST_API_SERVER}/leave/checkAvailableLeaves/${domainID}/${year}/${leaveType}`)
  }

  public applyLeave(leaveDuration){
    return this.httpClient.post(`${this.REST_API_SERVER}/leave/applyLeave`,leaveDuration);
  }

  public sendLeaveRequestEmail(leaveDuration){
    return this.httpClient.post(`${this.REST_API_SERVER}/leave/sendEmail`,leaveDuration);
  }

  public getMinDate(domainId){
    return this.httpClient.get(`${this.REST_API_SERVER}/leave/calcMinLeaveDate/${domainId}`);
  }

  public viewLeaveDetails(domainId,dateSubmitted){
    return this.httpClient.get(`${this.REST_API_SERVER}/leave/viewLeave/${domainId}/${dateSubmitted}`);
  }

  public updateLeaveStatus(leaveApprovalDetails){
    return this.httpClient.patch(`${this.REST_API_SERVER}/leave/updateLeaveStatus`,leaveApprovalDetails);
  }

  public getExisitingLeavesDates(domainId){
    return this.httpClient.get(`${this.REST_API_SERVER}/leave/getApprovedOrPendingLeaveDates/${domainId}`);
  }
}
