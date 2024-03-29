import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import Variablepie from 'highcharts/modules/variable-pie';
import { AuthModel } from 'src/app/model/Authentication.model';
import { EmployeeService } from '../service/employee.service';
import { ChartData } from 'src/app/model/ChartData.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit,OnDestroy {
  currentManager:AuthModel;
  destroy$ : Subject<boolean> = new Subject<boolean>();

  constructor(
    private employeeService: EmployeeService,
    private router:Router
  ) {
    this.currentManager = JSON.parse(localStorage.getItem('currentUser'));
   }

  ngOnInit(): void {
    this.displayOverallLateReport();
    this.displayOverallLeaveReport();
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public displayOverallLateReport(){
    this.employeeService.getOverallLateReport(this.currentManager.username)
    .pipe(takeUntil(this.destroy$))
      .subscribe((results:ChartData[]) => {
        let late_report = this.generatePieChart('Punctual vs Late',results);
        Highcharts.chart('overall-late-report',late_report);
      });
  }

  public displayOverallLeaveReport(){
    this.employeeService.getOverallLeaveReport(this.currentManager.username)
    .pipe(takeUntil(this.destroy$))
      .subscribe((report:ChartData[])=> {
        let leave_report = this.generatePieChart('Annual vs Medical Leave',report);
        Highcharts.chart('overall-leave-report',leave_report);
      });
  }

  public viewReports(reportType){
    this.router.navigateByUrl(`/home/manager/all-report/${reportType}`);
  }

  public generatePieChart(chartName,report){
    let pie_chart:any = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: chartName,
        style: {
          fontWeight: 'bold'
        }
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
        data: report
      }]
    }
    return pie_chart;
  }
}