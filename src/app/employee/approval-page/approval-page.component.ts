import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../service/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthModel } from 'src/app/model/Authentication.model';

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
  displayedColumns:string[] = ['date','timeIn','timeOut','dateOut','ot','ut','lateness','remarks'];
  dataSource = [];
  allowExit:boolean = false;
  invalidInput:boolean = false;
  updateError:boolean = false;
  currentUser:any;
  user:AuthModel;
  validUser:boolean;
  errorMessage = '';
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
      localStorage.setItem('temproraryUrl',JSON.stringify(url));
    }
    this.user = _currUserObj;
   }

  ngOnInit(): void {
    this.userValidation();
    this.displayTimesheet();
    this.getEmpoyeeDetails();
    if (this.user.role === 'Manager')
      this.approvalValidation();
  }

  public userValidation(){
    this.employeeService.getProfile(this.currUserDomainId)
      .subscribe (userInfo => {
        this.currentUser = userInfo;
        if (this.user.username === this.currentUser.department.department_head.domain_id || 
          this.user.username === this.currentUser.domain_id)
          this.validUser = true;
       else 
          this.validUser = false;
      });
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

  public editedValidation(timesheet){
    for ( let i = 0; i < timesheet.length; i++){
      if (timesheet[i].edit_status === 'Edited'){
        this.allowExit = true;
        break;
      } else {
        this.allowExit = false;
        break;
      }
    }
  }

  public displayTimesheet(){
    this.employeeService.getTimesheet(this.currUserDomainId,this.month.toString(),this.year).subscribe( timesheet =>{
      this.TIMESHEET = timesheet;
      this.editedValidation(this.TIMESHEET);
      this.dataSource = this.TIMESHEET;
    });
  }

  public tomorrow(date){
    let dateString = date.split('-',2);
    let day = parseInt(dateString[0]) + 1;
    let dayString = ("0" + day).slice(-2);
    let tomorrowDate = `${dayString}-${dateString[1]}`;
    return tomorrowDate;
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
    this.employeeService.allowTimesheetEdit(this.selectedRows.selected).subscribe();
    this.employeeService.sendEmail(this.currUserDomainId,this.period,this.year,status).subscribe();
  }

  public isAllSelected() {
    const numSelected = this.selectedRows.selected.length;
    return numSelected;
  }

  public masterToggle() {
    this.isAllSelected() ? this.selectedRows.clear() : this.dataSource.forEach(row => {
      if(row.remarks !== 'Weekend' && row.time_in === '0000' && row.time_out ==='0000')
        this.selectedRows.select(row)
      else if(row.edit_status === 'Edited')
        this.selectedRows.select(row)
    });
  }

  public displayCheckBox(row){
    if (row.remarks !== 'Weekend' && row.time_in === '0000' && row.time_out ==='0000')
      return true;
    else if (row.edit_status === 'Edited')
      return true;
    else 
      return false;
  }

  public requestApproval(){
    let status = 'Reapproval';
    this.TIMESHEET = this.dataSource;
    this.TIMESHEET = this.TIMESHEET.filter (
      data => data.edit_status === 'Editable'
      );
    let editedRows = this.TIMESHEET;
    for(let i = 0;i < editedRows.length; i++){
      if (editedRows[i].time_in === '0000' && editedRows[i].time_out === '0000' 
        && editedRows[i].date_out === null && editedRows[i].remarks === null){
        this.updateError = true;
        this.errorMessage = 'Make sure all field is filled.';
        break;
      } else{
        this.updateError = false;
          this.employeeService.sendEmail(this.currUserDomainId,this.period,this.year,status).subscribe();
          this.employeeService.editTimesheet(this.TIMESHEET)
            .subscribe(
              data => {
                let editedArray:any = data;
                for (let i = 0;i< editedArray.length;i++){
                  if(editedArray[i].edit_status === 'Edited'){
                    this.displayMessage('Timesheet Updated Successfully');
                    this.allowExit = true;
                    break;
                  } else {
                    this.displayMessage('Unsuccessful Timesheet Update. Please Try Again');
                    this.allowExit = false;
                    break;
                  }
                }
              });
            break;
      }
    }
  }

  public updateTimeIn(row,newTimeIn){
    this.dataSource.forEach(element => {
      if (element.date_in === row.date_in){
        row.time_in = newTimeIn;
      }
    });
  }

  public updateTimeOut(row,newTimeOut){
    this.dataSource.forEach(element => {
      if (element.date_in === row.date_in){
        if(newTimeOut > row.time_in){
          row.time_out = newTimeOut;
          this.invalidInput = false;
        }
        else
          this.invalidInput = true;
      }
    });
  }

  public updateRemarks(row,newRemarks){
    this.dataSource.forEach( element => {
      if(element.date_in === row.date_in)
        row.remarks = newRemarks;
    });
  }

  public updateDateOut(row,newDateOut){
    this.dataSource.forEach(element => {
      if(element.date_in === row.date_in){
        if (row.date_in !== newDateOut && row.time_out !== row.time_in){
          row.date_out = newDateOut;
          this.invalidInput = false;
        } 
        else if (newDateOut === row.date_in && row.time_out > row.time_in){
          row.date_out = null;  
          this.invalidInput = false;
        }
        else{
          this.invalidInput = true;
        }
      }
    });
  }

  public exit(){
    localStorage.removeItem('temproraryUrl');
    this.router.navigateByUrl(this.returnUrl);
  }
}
