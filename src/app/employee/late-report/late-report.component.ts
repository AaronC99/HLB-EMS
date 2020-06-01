import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import Variablepie from 'highcharts/modules/variable-pie';
import { EmployeeService } from '../service/employee.service';
import { AuthModel } from 'src/app/model/Authentication.model';
import { EmployeeReport } from 'src/app/model/EmployeeReport.model';
import { ActivatedRoute, Router } from '@angular/router';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Variablepie(Highcharts);
Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-late-report',
  templateUrl: './late-report.component.html',
  styleUrls: ['./late-report.component.scss']
})
export class LateReportComponent implements OnInit, OnChanges{
  searchList = ['Attendance','Leave'];
  currentManager:AuthModel;
  deptLateReport:EmployeeReport[] = [];
  deptLeaveReport:EmployeeReport[];
  deptReport:EmployeeReport[];
  searchText:string;
  reportType = '';
  currentUrl = '/home/manager/all-report';

  constructor(
    private employeeService:EmployeeService,
    private route: ActivatedRoute,
    private router: Router
    ) {
      this.currentManager = JSON.parse(localStorage.getItem('currentUser'));
   }

  ngOnInit(): void {
    this.reportType= this.route.snapshot.paramMap.get('reportType');
    if (this.reportType === 'Attendance')
      this.displayAllLateReport();
    else if (this.reportType === 'Leave')
      this.displayAllLeaveReport();
  }

  ngOnChanges(changes: SimpleChanges){
    for (const propName in changes){
      let change = changes[propName];
      let currVal = JSON.stringify(change.currentValue);
      let prevVal = JSON.stringify(change.previousValue);
      console.log(currVal);
      console.log(prevVal);
    }
  }

  public searchTermEmpty(){
    if (this.searchText === ''){
      this.ngOnInit();
    }
  }

  public displayAllLateReport(){
    this.reportType = 'Attendance';
    this.router.navigateByUrl(`${this.currentUrl}/${this.reportType}`);
    this.employeeService.getDeptLateReport(this.currentManager.username)
    .subscribe((data:EmployeeReport[])=>{
      this.deptReport = data;
      setTimeout(() => {
        for (let i=0;i<this.deptReport.length;i++){
          let report = this.getEmployeeLateReport(this.deptReport[i]);
          report.chart.renderTo = `${this.deptReport[i].domain_id}-report`;
          Highcharts.chart(report);
        } 
      },1000);
    });
  }

  public displayAllLeaveReport(){
    this.reportType = 'Leave';
    this.router.navigateByUrl(`${this.currentUrl}/${this.reportType}`);
    this.employeeService.getDeptLeaveReport(this.currentManager.username)
    .subscribe((report:EmployeeReport[]) => {
      this.deptReport = report;
      setTimeout(() => {
        for(let i=0;i<this.deptReport.length;i++){
          let report = this.getEmployeeLateReport(this.deptReport[i]);
          report.chart.renderTo = `${this.deptReport[i].domain_id}-report`;
          Highcharts.chart(report);
        }
      },1000)
    });
  }

  public filterBy(value){
    if (value === 'Leave')
      this.displayAllLeaveReport();
    else if (value === 'Attendance')
      this.displayAllLateReport();
  }

  public getEmployeeLateReport(employee){
    let chart:any = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
          text: employee.name
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
          point: {
              valueSuffix: '%'
          }
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: false
              },
              showInLegend: true
          }
      },
      series: [
        {
        name: 'Total',
        colorByPoint: true,
        data: employee.report
        }
      ]
    } 
    return chart;
  }
}