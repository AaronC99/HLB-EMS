import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../service/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  displayedColumns: string[] = ['date','timeIn','timeOut','ot','ut','lateness','remarks'];
  dataSource = [];
  canExit:boolean = false;
  constructor(
    private route:ActivatedRoute,
    private employeeService: EmployeeService,
    private _snackBar: MatSnackBar
  ) {
    this.currUserDomainId = this.route.snapshot.paramMap.get('domainId');
    this.month = this.route.snapshot.paramMap.get('period');
    this.year = this.route.snapshot.paramMap.get('year');
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

  displayMessage(message:string){
    this._snackBar.open(message,'Close',{
      duration: 3000
    });
  }

  public rejectTimesheet(){
    this.displayMessage('Timesheet Rejected Successfully');
    this.canExit = true;
  }

}
