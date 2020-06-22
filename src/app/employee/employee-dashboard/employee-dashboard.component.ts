import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmployeeService } from '../service/employee.service';
import { AuthModel } from 'src/app/model/Authentication.model';
import { ChartData } from 'src/app/model/ChartData.model';
import * as Highcharts from 'highcharts';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit,OnDestroy {
  overallLateReport:any = {};
  currentUser: AuthModel;
  destroy$ : Subject<boolean> = new Subject<boolean>();

  constructor(
    private employeeService: EmployeeService
  ) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit(): void {
    this.displayOverallLateReport();
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public displayOverallLateReport(){
    this.employeeService.getEmployeeLateReport(this.currentUser.username)
    .pipe(takeUntil(this.destroy$))
      .subscribe((results:ChartData[]) => {
        this.overallLateReport = {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
              text: 'Overall Attendance'
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
          series: [{
            name: 'Total',
            colorByPoint: true,
            data: results
          }]
        }
        Highcharts.chart('emp-late-report',this.overallLateReport);
      });
  }
}