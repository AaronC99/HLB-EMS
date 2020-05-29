import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from 'src/app/model/Employee.model';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private REST_API_SERVER = "http://localhost:3000";

  constructor(
    private httpClient: HttpClient,
    private _snackBar: MatSnackBar
  ) {
   }

  // Employee Services API
  public getProfile(domainId){
    return this.httpClient.get(`${this.REST_API_SERVER}/profile/${domainId}`);
  }

  public getAllEmployees(DomainID:String){
    return this.httpClient.get(this.REST_API_SERVER+'/employee/allEmployees/'+DomainID);
  }

  public setNewPassword(newPassword){
    return this.httpClient.patch(`${this.REST_API_SERVER}/employee/changePassword`,newPassword)
  }

  // Clock In/Out API
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

  //Timesheet API
  public getTimesheet(domainId:string,month:string,year:string){
    return this.httpClient.get(`${this.REST_API_SERVER}/timesheet/viewTimesheet/${domainId}/${month}/${year}`);
  }

  public getAvailableTimesheet(domainId:string){
    return this.httpClient.get(`${this.REST_API_SERVER}/timesheet/availableTimesheet/${domainId}`);
  }

  public sendEmail(domainId:string,period:string,year:string,status:string){
    this.httpClient.post(`${this.REST_API_SERVER}/timesheet/sendEmail`
    ,{"domain_id":domainId,"period":period,"year":year,"type":status})
    .subscribe(res => {
      if(status === 'Reapproval')
        this.displayMessage('Request successfully sent to Department Head','success'); 
      else if (status === 'Approved' || status === 'Rejected')
        this.displayMessage('Email has been sent to employee','success');
      else
        this.displayMessage('Email Not Found.','failure');
    },
    err =>{
      this.displayMessage('Error sending request. Please try again','failure');
    });;
  }

  public updateTimesheetStatus(domainId:string,period:string,year:string,status:string){ 
    return this.httpClient.patch(`${this.REST_API_SERVER}/timesheet/updateTimesheetStatus/${domainId}/${period}/${year}`
    ,{
      "approval_status":status
    });
  }

  public allowTimesheetEdit(recordsForEdit){
    this.httpClient.patch(`${this.REST_API_SERVER}/timesheet/setEditableTimesheet` ,recordsForEdit)
      .subscribe(res => {
        console.log(res);
      });
  }

  public editTimesheet(editedArray){
    return this.httpClient.patch(`${this.REST_API_SERVER}/timesheet/editTimesheet`,editedArray);
  }

  // Leave API
  public checkAvailableLeaves(domainID,year,leaveType){
    return this.httpClient.get(`${this.REST_API_SERVER}/leave/checkAvailableLeaves/${domainID}/${year}/${leaveType}`)
  }

  public applyLeave(leaveDuration,supervisor){
    this.httpClient.post(`${this.REST_API_SERVER}/leave/applyLeave`,leaveDuration)
      .subscribe(res=> {
        let appliedLeaves:any = res;
        if (appliedLeaves.length !== 0){
          this.displayMessage('Leave Applied Successful','success');
          let leaveRequestDetail = {
            domain_id: appliedLeaves[0]['employee_id'],
            type: 'Approval',
            date: appliedLeaves[0]['date'],
            year: appliedLeaves[0]['year'], 
            date_submitted: appliedLeaves[0]['date_submitted']
          };
          if (supervisor !== null){
            this.sendLeaveRequestEmail(leaveRequestDetail,supervisor,leaveRequestDetail.type);
          }
          else {
            // Automatically Approve Leave 
            let leaveApprovalArray = [];
            leaveDuration.forEach(element => {
              let leaveApprovalDetail = {
                domain_id: element.domain_id,
                date:element.date,
                year:element.year,
                approval_status: status
              };
              leaveApprovalArray.push(leaveApprovalDetail);
            });
            this.updateLeaveStatus(leaveApprovalArray,null,status);
          }
        } else
          this.displayMessage('Leave Applied Unsuccessful','failure');
    },err => {
      this.displayMessage('Leave Applied Unsuccessful. Please try again.','failure')
    });
  }

  public sendLeaveRequestEmail(leaveDetail,receiver,statusType){
    this.httpClient.post(`${this.REST_API_SERVER}/leave/sendEmail`,leaveDetail)
    .subscribe(data => {
      if (data !== null){
        if (statusType === 'Approval')
          this.displayMessage(`Leave Request Email Successfully Sent to ${receiver} for ${statusType}`,'success');
        else
          this.displayMessage(`${statusType} Leave Email Successfully Sent to ${receiver}`,'success');
      }else 
        this.displayMessage('Email Sent Unsuccessful','failure');
    },err =>{
      this.displayMessage('Unable to Send Email. Please try again.','failure');
    });
  }

  public getMinDate(domainId){
    return this.httpClient.get(`${this.REST_API_SERVER}/leave/calcMinLeaveDate/${domainId}`);
  }

  public viewLeaveDetails(domainId,dateSubmitted){
    return this.httpClient.get(`${this.REST_API_SERVER}/leave/viewLeave/${domainId}/${dateSubmitted}`);
  }

  public updateLeaveStatus(leaveApprovalDetails,employeeName,status){
    this.httpClient.patch(`${this.REST_API_SERVER}/leave/updateLeaveStatus`,leaveApprovalDetails)
    .subscribe(data => {
      let details:any = data;
      let actionStatus = '';
      if(details.length !== 0){
        this.displayMessage(`Leave Request ${status} Successful`,'success');
        if (status === 'Approved'){
          actionStatus = 'Approve';
        } else if(status === 'Rejected') {
          actionStatus = 'Reject';
        }
        let leaveDetails = {
          domain_id: details[0].employee_id,
          type: actionStatus,
          date: details[0].date,
          year: details[0].year, 
          date_submitted: details[0].date_submitted
        };
        if (employeeName !== null)
          this.sendLeaveRequestEmail(leaveDetails,employeeName,status);
      }   
    },err => {
      this.displayMessage(`${status} Failed. Please Try Again.`,'failure');
    });
  }

  public getExisitingLeavesDates(domainId){
    return this.httpClient.get(`${this.REST_API_SERVER}/leave/getApprovedOrPendingLeaveDates/${domainId}`);
  }

  //Reporting
  public getOverallLateReport(managerId){
    return this.httpClient.get(`${this.REST_API_SERVER}/report/overallLateReport/${managerId}`);
  }

  public getEmployeeLateReport(employeeId){
    return this.httpClient.get(`${this.REST_API_SERVER}/report/empLateReport/${employeeId}`);
  }

  public displayMessage(message:string,status:string){
    this._snackBar.open(message,'Close',{
      duration: 5000,
      panelClass: `notif-${status}`
    });
  }
}
