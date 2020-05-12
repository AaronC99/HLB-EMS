import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../service/employee.service';
import * as moment from 'moment';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { AuthModel } from 'src/app/model/Authentication.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-leave-approval',
  templateUrl: './leave-approval.component.html',
  styleUrls: ['./leave-approval.component.scss']
})
export class LeaveApprovalComponent implements OnInit {
  validUser:boolean;
  currentUser:string;
  employee:any;
  dateSubmitted:string;
  returnUrl = '';
  leaveDetails:any;
  dates = [];
  manager:AuthModel;
  status:string;
  leaveApprovalArray = [];
  leaveApprovalDetails:any;
  canExit:boolean;

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private employeeService: EmployeeService,
    private authService: AuthenticationService,
    private _snackBar: MatSnackBar
    ) { 
      this.currentUser = this.route.snapshot.paramMap.get('domainId');
      this.dateSubmitted = this.route.snapshot.paramMap.get('date_submitted');
      this.authService.userAuthDetails.subscribe(data=>{
        this.manager = data;
      })
    }

  ngOnInit(): void {
    this.getCurrentUserInfo();
  }

  public getCurrentUserInfo(){
    this.employeeService.getProfile(this.currentUser).subscribe(data =>{
      this.employee = data;
      if (this.manager.username === this.employee.department.department_head.domain_id){
        this.validUser = true;
        this.getLeaveDetails();
      }
      else {
        this.validUser = false;
      }
    });
  }

  public getLeaveDetails(){
    this.employeeService.viewLeaveDetails(this.currentUser,this.dateSubmitted)
    .subscribe(data =>{
      this.leaveDetails = data;
      if(this.leaveDetails.length === 0){
        this.canExit = true;
      }
      else {
        this.canExit = false;
        this.leaveDetails.forEach(element => {
          let dayName = moment(`${element.date}-${element.year}`,"DD-MM-YYYY").format('dddd');
          let dateModel = {
            fullDate: `${element.date}-${element.year}`,
            day: dayName
          }
          this.dates.push(dateModel);
        });
      }
    });
  }

  public setLeaveApprovalDetails(status){
    this.leaveDetails.forEach(element => {
      this.leaveApprovalDetails = {
        domain_id: element.employee_id,
        date:element.date,
        year:element.year,
        approval_status: status
      };
      this.leaveApprovalArray.push(this.leaveApprovalDetails);
    });
  }

  public approveLeave(){
    this.leaveApprovalArray.splice(0,this.leaveApprovalArray.length);
    this.status = 'Approved'
    this.setLeaveApprovalDetails(this.status);
    this.employeeService.updateLeaveStatus(this.leaveApprovalArray)
      .subscribe(data => {
        let record:any = data;
        if(record.length !== 0){
          this.displayMessage('Leave Request Approved Successful');
          this.sendEmail('Approve');
        }   
      },err => {
        this.displayMessage('Approved Failed. Please Try Again.');
      });
  }

  public rejectLeave(){
    this.leaveApprovalArray.splice(0,this.leaveApprovalArray.length);
    this.status = 'Rejected';
    this.setLeaveApprovalDetails(this.status);
    console.log(this.leaveApprovalArray);
    this.employeeService.updateLeaveStatus(this.leaveApprovalArray)
      .subscribe(data => {
        console.log(data);
        let record:any = data;
        if(record.length !== 0){
          this.displayMessage('Leave Request Rejected Successful');
          this.sendEmail('Reject');
        }
      },err => {
        this.displayMessage('Reject Failed. Please Try Again.');
      });
  }

  public sendEmail(statusType){
    let leaveRequestDetails = {
      domain_id: this.currentUser,
      type: statusType,
      date: this.leaveApprovalDetails.date,
      year: this.leaveApprovalDetails.year, 
      date_submitted: this.dateSubmitted
    };
    this.employeeService.sendLeaveRequestEmail(leaveRequestDetails).subscribe(data => {
      if(data !== null){
        this.displayMessage(`Email Successfully Sent to ${this.employee.name}`);
        this.canExit = true;
      }
    });
  }
  public displayMessage(message:string){
    this._snackBar.open(message,'Close',{
      duration: 3000
    });
  }
  public exit(){
    this.router.navigateByUrl(this.returnUrl);
  }
}
