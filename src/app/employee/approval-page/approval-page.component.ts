import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../service/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';

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
  monthName:string;
  year:string;
  TIMESHEET:any;
  displayedColumns: string[];
  dataSource = [];
  allowExit:boolean = false;
  currUser:any;
  supervisor:any;
  validUser:boolean;
  returnUrl = '';
  statusType = '';
  showCheckBox = false;
  selectedRows = new SelectionModel<any>(true,[]);

  constructor(
    private route:ActivatedRoute,
    private employeeService: EmployeeService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.currUserDomainId = this.route.snapshot.paramMap.get('domainId');
    this.period = this.route.snapshot.paramMap.get('period');
    this.month = parseInt(this.period) + 1;
    this.monthName = moment().month(this.period).format('MMMM');
    this.year = this.route.snapshot.paramMap.get('year');

    let _currUserObj:any = JSON.parse(localStorage.getItem('currentUser'));
    let url = this.router.url;
    if(localStorage.getItem('currentUser') === null){
      this.router.navigateByUrl(this.returnUrl);
      localStorage.setItem('timesheetApprovalUrl',JSON.stringify(url));
    }
    this.supervisor = _currUserObj.username;
    this.employeeService.getProfile(this.currUserDomainId)
      .subscribe (userInfo => {
        this.currUser = userInfo;
        if (this.supervisor === this.currUser.department.department_head.domain_id)
          this.validUser = true;
       else 
          this.validUser = false;
      });
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
      for (let i = 0;i < validateArr.length;i++){
        if (validateArr[i].period_number === this.period && 
          validateArr[i].year === this.year && 
          validateArr[i].approval_status !== 'Pending'){
            this.allowExit = true;
            this.displayedColumns = ['date','timeIn','timeOut','dateOut','ot','ut','lateness','remarks'];
            break;
        } 
        else if ( validateArr[i].period_number === this.period && 
          validateArr[i].year === this.year && 
          validateArr[i].approval_status === 'Pending'){
            this.allowExit = false;
            this.displayedColumns = ['editStatus','date','timeIn','timeOut','dateOut','ot','ut','lateness','remarks'];
            break;
        }
      }
    });
  }

  public displayTimesheet(){
    this.employeeService.getTimesheet(this.currUserDomainId,this.month.toString(),this.year).subscribe( timesheet =>{
      this.TIMESHEET= timesheet;
      this.dataSource = this.TIMESHEET;
    });
  }

  public approveTimesheet(){
    this.statusType = 'Approved';
    this.employeeService.updateTimesheetStatus(this.currUserDomainId,this.period,this.year,this.statusType)
    .subscribe( data => {
      if(data['approval_status'] === 'Approved'){
        this.displayMessage('Timesheet Approved Successfully');
        this.allowExit = true;
      }
      else 
        this.displayMessage('Unsuccessful Timesheet approval');
    })
  }

  public displayMessage(message:string){
    this._snackBar.open(message,'Close',{
      duration: 3000
    });
  }

  public rejectTimesheet(){
    this.statusType = 'Rejected';
    let status = 'Reject';
    this.employeeService.updateTimesheetStatus(this.currUserDomainId,this.period,this.year,this.statusType)
      .subscribe(data => {
        if (data['approval_status'] === 'Rejected'){
          this.displayMessage('Timesheet Rejected Successfully');
          this.allowExit = true;
        }
      });
    this.employeeService.allowTimesheetEdit(this.selectedRows.selected);
    this.employeeService.sendEmail(this.currUserDomainId,this.period,this.year,status);
  }

  public isAllSelected() {
    const numSelected = this.selectedRows.selected.length;
    return numSelected;
  }

  public masterToggle() {
    this.isAllSelected() ? this.selectedRows.clear() : this.dataSource.forEach(row => {
      if(row.remarks !== 'Weekend' && row.time_in === '0000' && row.time_out ==='0000')
        this.selectedRows.select(row)
    });
  }

  public exit(){
    localStorage.removeItem('timesheetApprovalUrl');
    this.router.navigateByUrl(this.returnUrl);
  }
}
