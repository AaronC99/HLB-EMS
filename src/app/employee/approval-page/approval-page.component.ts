import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../service/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';

@Component({
  selector: 'app-approval-page',
  templateUrl: './approval-page.component.html',
  styleUrls: ['./approval-page.component.scss']
})
export class ApprovalPageComponent implements OnInit {
  currUserDomainId:string;
  month: string;
  year:string;
  TIMESHEET:any;
  displayedColumns: string[] = ['date','timeIn','timeOut','dateOut','ot','ut','lateness','remarks'];
  dataSource = [];
  canExit:boolean = false;
  currUser:any;
  supervisor:any;
  validUser:boolean;
  returnUrl = '';

  constructor(
    private route:ActivatedRoute,
    private employeeService: EmployeeService,
    private _snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.currUserDomainId = this.route.snapshot.paramMap.get('domainId');
    this.month = this.route.snapshot.paramMap.get('period');
    this.year = this.route.snapshot.paramMap.get('year');

    this.authService.userAuthDetails.subscribe (user =>{
      this.supervisor = user.username; 
    });

    this.employeeService.getProfile(this.currUserDomainId)
      .subscribe (userInfo => {
        this.currUser = userInfo;
        if (this.supervisor === this.currUser.department.department_head.domain_id){
          this.validUser = true;
        } else 
          this.validUser = false;
      });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
   }

  ngOnInit(): void {
    this.displayTimesheet();
  }

  public displayTimesheet(){
    this.employeeService.getTimesheet(this.currUserDomainId,this.month,this.year).subscribe( timesheet =>{
      this.TIMESHEET= timesheet;
      this.dataSource = this.TIMESHEET;
    });
  }

  public approveTimesheet(){
    let period = parseInt(this.month) - 1;
    this.employeeService.approveTimesheet(this.currUserDomainId,period.toString(),this.year)
    .subscribe( data =>{
      if(data['is_approved'])
        this.displayMessage('Timesheet Approved Successfully')
    })
    this.canExit = true;
  }

  public displayMessage(message:string){
    this._snackBar.open(message,'Close',{
      duration: 3000
    });
  }

  public rejectTimesheet(){
    this.displayMessage('Timesheet Rejected Successfully');
    this.canExit = true;
  }

  public exit(){
    this.router.navigateByUrl(this.returnUrl);
  }

}
