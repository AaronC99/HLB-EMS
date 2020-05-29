import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import Variablepie from 'highcharts/modules/variable-pie';
import { EmployeeService } from '../service/employee.service';
import { AuthModel } from 'src/app/model/Authentication.model';
import { EmployeeReport } from 'src/app/model/EmployeeReport.model';

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
export class LateReportComponent implements OnInit {
  searchList = ['Attendance','Leaves'];
  currentManager:AuthModel;
  deptLateReport:EmployeeReport[] = [];
  deptLeaveReport:EmployeeReport[];
  deptReport:EmployeeReport[];
  searchText:string;

  constructor(
    private employeeService:EmployeeService
    ) {
      this.currentManager = JSON.parse(localStorage.getItem('currentUser'));
   }

  ngOnInit(): void {
    this.displayAllLateReport();
  }

  public displayAllLateReport(){
    this.employeeService.getDeptLateReport(this.currentManager.username)
    .subscribe((data:EmployeeReport[])=>{
      this.deptReport = data;
    })
  }

  public displayAllLeaveReport(){
    this.employeeService.getDeptLeaveReport(this.currentManager.username)
    .subscribe((report:EmployeeReport[]) => {
      this.deptReport = report;
    });
  }

  public filterBy(value){
    if (value === 'Leaves')
      this.displayAllLeaveReport();
    else 
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
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              }
          }
      },
      series: [{
        name: 'Brands',
        colorByPoint: true,
        data: employee.report
      }]
    } 
    //Highcharts.chart(`${employee.domain_id}-report`,chart);
    return chart;
  }
}