import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../service/employee.service';
import * as moment from 'moment';
import { AuthModel } from 'src/app/model/Authentication.model';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';

@Component({
  selector: 'app-leave-approval',
  templateUrl: './leave-approval.component.html',
  styleUrls: ['./leave-approval.component.scss']
})
export class LeaveApprovalComponent implements OnInit {
  validUser:boolean;
  currentUserId:string;
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
    private authService:AuthenticationService
    ) { 
      this.currentUserId = this.route.snapshot.paramMap.get('domainId');
      this.dateSubmitted = this.route.snapshot.paramMap.get('date_submitted');
      this.manager = JSON.parse(localStorage.getItem('currentUser'));
      let url = this.router.url;
      if(localStorage.getItem('currentUser') === null){
        this.router.navigateByUrl(this.returnUrl);
        localStorage.setItem('temproraryUrl',JSON.stringify(url));
      }

      this.authService.verifyUserIdle();
      this.authService.userIsIdle.subscribe(isIdle => {
        if (isIdle){
          this.exit();
        }
      });
    }

  ngOnInit(): void {
    this.getCurrentUserInfo();
  }

  public getCurrentUserInfo(){
    this.employeeService.getProfile(this.currentUserId).subscribe(data =>{
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
    this.employeeService.viewLeaveDetails(this.currentUserId,this.dateSubmitted)
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
    this.status = 'Approved';
    this.setLeaveApprovalDetails(this.status);
    this.employeeService.updateLeaveStatus(this.leaveApprovalArray,this.employee.name,this.status);
    this.canExit = true;
  }

  public rejectLeave(){
    this.status = 'Rejected';
    this.setLeaveApprovalDetails(this.status);
    this.employeeService.updateLeaveStatus(this.leaveApprovalArray,this.employee.name,this.status);
    this.canExit = true;
  }

  public exit(){
    localStorage.removeItem('temproraryUrl');
    window.close();
  }
}