import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../service/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import * as moment from 'moment';

@Component({
  selector: 'app-approval-page',
  templateUrl: './approval-page.component.html',
  styleUrls: ['./approval-page.component.scss']
})
export class ApprovalPageComponent implements OnInit {
  employee:any
  currUserDomainId:string;
  period: string;
  month:number;
  monthName = moment(this.month).format('MMMM');
  year:string;
  TIMESHEET:any;
  displayedColumns: string[] = ['date','timeIn','timeOut','dateOut','ot','ut','lateness','remarks'];
  dataSource = [];
  approved:boolean = false;
  currUser:any;
  supervisor:any;
  validUser:boolean = false;
  returnUrl = '';

  constructor(
    private route:ActivatedRoute,
    private employeeService: EmployeeService,
    private _snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.currUserDomainId = this.route.snapshot.paramMap.get('domainId');
    this.period = this.route.snapshot.paramMap.get('period');
    this.month = parseInt(this.period) + 1;
    this.year = this.route.snapshot.paramMap.get('year');

    this.authService.userAuthDetails.subscribe (user =>{
      this.supervisor = user.username; 
    });

    this.employeeService.getProfile(this.currUserDomainId)
      .subscribe (userInfo => {
        this.currUser = userInfo;
        if (this.supervisor === this.currUser.department.department_head.domain_id)
          this.validUser = true;
      });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
   }

  ngOnInit(): void {
    this.displayTimesheet();
    this.getEmpoyeeDetails();
    this.approvalValidation();
  }

  public getEmpoyeeDetails(){
    this.employeeService.getProfile(this.currUserDomainId)
    .subscribe (userInfo => {
      this.employee = userInfo;
    });
  }

  public approvalValidation(){
    this.employeeService.getAvailableTimesheet(this.currUserDomainId)
    .subscribe( data =>{
      let validateArr:any = data;
      validateArr.forEach(element => {
        if (element['period_number'] === this.period && element['year'] === this.year && 
          element['is_approved'] === true){
          this.approved = true;
        }  else 
          this.approved = false;
      });
    });
  }

  public displayTimesheet(){
    this.employeeService.getTimesheet(this.currUserDomainId,this.month.toString(),this.year).subscribe( timesheet =>{
      this.TIMESHEET= timesheet;
      this.dataSource = this.TIMESHEET;
    });
  }

  public approveTimesheet(){
    this.employeeService.approveTimesheet(this.currUserDomainId,this.period,this.year)
    .subscribe( data =>{
      if(data['is_approved']){
        this.displayMessage('Timesheet Approved Successfully');
        this.approved = true;
      }
      else 
        this.displayMessage('Unsuccessful Timesheet approval')
    })
  }

  public displayMessage(message:string){
    this._snackBar.open(message,'Close',{
      duration: 3000
    });
  }

  public rejectTimesheet(){
    this.displayMessage('Timesheet Rejected Successfully');
    this.approved = false;
  }

  public exit(){
    this.router.navigateByUrl(this.returnUrl);
  }

}
