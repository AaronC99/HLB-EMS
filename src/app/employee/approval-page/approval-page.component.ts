import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../service/employee.service';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthModel } from 'src/app/model/Authentication.model';
import { LeaveApproval } from 'src/app/model/LeaveApproval.model';
import { Employee } from 'src/app/model/Employee.model';
import { Timesheet } from 'src/app/model/Timesheet.model';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { NotificationService } from 'src/app/notification/notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-approval-page',
  templateUrl: './approval-page.component.html',
  styleUrls: ['./approval-page.component.scss']
})
export class ApprovalPageComponent implements OnInit,OnDestroy {
  employee:Employee;
  currUserDomainId:string;
  period: string;
  month:number;
  monthName:string;
  year:string;
  TIMESHEET:Timesheet[];
  leaveTypes = [
    {id:0, value:'None'},
    {id:1, value:'Annual'},
    {id:2, value:'Medical'}
  ];
  editedLeaves = [];
  editedTimesheet = [];
  displayedColumns:string[] = ['date','timeIn','timeOut','dateOut','ot','ut','lateness','remarks'];
  dataSource = [];
  allowExit:boolean = false;
  invalidInput:boolean = false;
  updateError:boolean = false;
  currentUser:Employee;
  user:AuthModel;
  validUser:boolean;
  errorMessage = '';
  returnUrl = '';
  statusType = '';
  showCheckBox = false;
  selectedRows = new SelectionModel<any>(true,[]);
  _leaveObj:LeaveApproval;
  destroy$ : Subject<boolean> = new Subject<boolean>();

  constructor(
    private route:ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router, 
    private authService: AuthenticationService,
    private notifService: NotificationService
  ) {
    this.currUserDomainId = this.route.snapshot.paramMap.get('domainId');
    this.period = this.route.snapshot.paramMap.get('period');
    this.month = parseInt(this.period) + 1;
    this.monthName = moment().month(this.period).format('MMMM');
    this.year = this.route.snapshot.paramMap.get('year');

    this.user = JSON.parse(localStorage.getItem('currentUser'));
    let url = this.router.url;
    if(localStorage.getItem('currentUser') === null){
      this.router.navigateByUrl(this.returnUrl);
      localStorage.setItem('temproraryUrl',JSON.stringify(url));
    }

    this.authService.verifyUserIdle();
    this.authService.userIsIdle
    .pipe(takeUntil(this.destroy$))
      .subscribe(isIdle => {
        if (isIdle){
          this.exit();
        }
      });
   }

  ngOnInit(): void {
    this.userValidation();
    this.displayTimesheet();
    this.getEmployeeDetails();
    if (this.user.role === 'Manager')
      this.approvalValidation();
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public userValidation(){
    // Validate If User is the Manager
    this.employeeService.getProfile(this.currUserDomainId)
    .pipe(takeUntil(this.destroy$))
      .subscribe ((userInfo:Employee) => {
        this.currentUser = userInfo;
        if (this.user.username === this.currentUser.department.department_head.domain_id || 
          this.user.username === this.currentUser.domain_id)
          this.validUser = true;
       else 
          this.validUser = false;
      });
  }

  public getEmployeeDetails(){
    this.employeeService.getProfile(this.currUserDomainId)
    .pipe(takeUntil(this.destroy$))
      .subscribe ((userInfo:Employee) => {
        this.employee = userInfo;
      });
  }

  public approvalValidation(){
    // Check Whether has been approved or not
    this.employeeService.getAvailableTimesheet(this.currUserDomainId)
    .pipe(takeUntil(this.destroy$))
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
              this.displayedColumns = ['editStatus','date','timeIn','timeOut','dateOut','ot','ut','lateness','remarks','leave'];
              break;
          }
        }
      });
  }

  public editedValidation(timesheet){
    // Check if timesheet has been edited
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
    this.employeeService.getTimesheet(this.currUserDomainId,this.month.toString(),this.year)
    .pipe(takeUntil(this.destroy$))
      .subscribe( (timesheet:Timesheet[]) =>{
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

  public approveLeaves(){
     // Call Apply leave api
     this.employeeService.applyLeave(this.editedLeaves,null);

    // Allow Timesheet For Edit
    this.editedTimesheet.forEach(et => {
      this.editedLeaves.forEach(el => {
        if (et.date_in === el.date){
          et.leave = el.leave_type;
        }
      });
    });
    this.employeeService.allowTimesheetEdit(this.editedTimesheet);

    // Edit Timesheet
    this.employeeService.editTimesheet(this.editedTimesheet)
    .subscribe(data =>{
      let editedRows:any = data;
      for (let i=0;i < editedRows.length;i++){
        if(editedRows[i] === null){
          this.employeeService.displayMessage('Timesheet Updated Unsuccessfully','failure');
          break;
        }else {
          this.employeeService.displayMessage('Timesheet Updated Successfully','success');
          break;
        }
      }
    });
  }

  public approveTimesheet(){
    this.statusType = 'Approved';
    
    // Check whether there is changed leave in timesheet
    if (this.editedTimesheet.length !== 0)
      this.approveLeaves();

    //Approve Timesheet Status
    this.employeeService.updateTimesheetStatus(this.currUserDomainId,this.period,this.year,this.statusType)
    .subscribe( data => {
      if(data['approval_status'] === 'Approved'){
        this.employeeService.displayMessage('Timesheet Approved Successfully','success');
        this.allowExit = true;
        this.notifyEmployee();
      }
      else 
        this.employeeService.displayMessage('Unsuccessful Timesheet approval','failure');
    });
  }

  public rejectTimesheet(){
    //Check whether there is changed leave in timesheet
    if (this.editedTimesheet.length !== 0)
      this.approveLeaves();

    // Reject Timesheet
    this.statusType = 'Rejected';
    this.employeeService.allowTimesheetEdit(this.selectedRows.selected);
    this.employeeService.updateTimesheetStatus(this.currUserDomainId,this.period,this.year,this.statusType)
      .subscribe(data => {
        if (data['approval_status'] === 'Rejected'){
          this.employeeService.displayMessage('Timesheet Rejected Successfully','success');
          this.allowExit = true;
          this.notifyEmployee();
        }
      });
    this.employeeService.sendEmail(this.currUserDomainId,this.period,this.year,this.statusType,null);
  }

  public notifyEmployee(){
    let notifContent = `Your Timesheet for ${parseInt(this.period)+1}-${this.year} is ${this.statusType}`;
    let notification = this.employeeService.getNotifObj(this.currUserDomainId,notifContent);
    if (this.statusType === 'Rejected')
      notification.link = `timesheet-reject/${this.currUserDomainId}/${this.period}/${this.year}`;
    this.notifService.sendNotification(notification);
  }

  public isAllSelected() {
    const numSelected = this.selectedRows.selected.length;
    return numSelected;
  }

  public masterToggle() {
    this.isAllSelected() ? this.selectedRows.clear() : this.dataSource.forEach(row => {
      if(row.remarks !== 'Weekend')
        this.selectedRows.select(row)
    });
  }

  public displayCheckBox(row){
    if (row.remarks !== 'Weekend' || row.edit_status === 'Edited')
      return true;
    else 
      return false;
  }

  public displayLeaveSelection(element){
    if (this.user.role === 'Manager' && element.remarks !== 'Weekend'){
      if(element.leave === null || element.leave === undefined)
        return true;
      else 
        return false;
    }
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
        this.employeeService.sendEmail(this.currUserDomainId,this.period,this.year,status,this.employee.department.department_head.domain_id);
        this.employeeService.editTimesheet(this.TIMESHEET)
        .subscribe(
          data => {
            let editedArray:any = data;
            for (let i = 0;i< editedArray.length;i++){
              if(editedArray[i].edit_status === 'Edited'){
                this.employeeService.displayMessage('Timesheet Updated Successfully','success');
                this.allowExit = true;
                break;
              } else {
                this.employeeService.displayMessage('Unsuccessful Timesheet Update. Please Try Again','failure');
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

  public setLeaveType(leaveType,row){
    if (leaveType.id !== 0){
      this.dataSource.forEach(element=>{
        if (element.date_in === row.date_in){
          row.time_in = row.time_out = '0000';
          row.date_out = null;
          row.ot = row.ut = row.late = 0;
          row.remarks = `${leaveType.value} Leave`;
          this.editedTimesheet.push(row);
          this._leaveObj = {
            domain_id: this.currentUser.domain_id,
            manager_id: this.user.username,
            leave_type: leaveType.value,
            date: row.date_in,
            year: row.year
          }
          this.editedLeaves.push(this._leaveObj);
        }
      });
    } else {
      if (this.editedTimesheet.length !== 0){
        let selectedLeave:LeaveApproval;
        // Change the remarks on the table
        this.editedTimesheet.forEach(record => {
          if (record.date_in === row.date_in){
            row.remarks = '';
            for (let el of this.editedLeaves){
              if (el.date === record.date_in){
                selectedLeave = {
                  domain_id: el.domain_id,
                  manager_id: el.manager_id,
                  leave_type: el.leave_type,
                  date: el.date,
                  year: el.year
                };
                break;
              }
            }
          }
        });

        // Splice Timesheet Array 
        let indexTs = this.editedTimesheet.indexOf(row,0);
        if (indexTs > -1)
          this.editedTimesheet.splice(indexTs,1);

        // Splice Leave Array
        let indexLv = this.editedLeaves.findIndex(element => element.date === selectedLeave.date);
        if (indexLv > -1)
          this.editedLeaves.splice(indexLv,1);
      }
    }
  }

  public exit(){
    localStorage.removeItem('temproraryUrl');
    this.router.navigateByUrl(this.returnUrl);
    window.close();
  }
}
