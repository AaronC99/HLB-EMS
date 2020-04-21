import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../service/employee.service';

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
  constructor(
    private route:ActivatedRoute,
    private employeeService: EmployeeService
  ) {
    this.currUserDomainId = this.route.snapshot.paramMap.get('domainId');
    this.month = this.route.snapshot.paramMap.get('month');
    this.year = this.route.snapshot.paramMap.get('year');
   }

  ngOnInit(): void {
  }

  public displayTimesheet(){
    this.employeeService.getTimesheet(this.currUserDomainId,this.month,this.year).subscribe( timesheet =>{
      this.TIMESHEET= timesheet;
      
    });
  }

}
