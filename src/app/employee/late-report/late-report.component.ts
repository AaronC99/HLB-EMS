import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as Highcharts from 'highcharts';
import Variablepie from 'highcharts/modules/variable-pie';
import { EmployeeService } from '../service/employee.service';
import { AuthModel } from 'src/app/model/Authentication.model';

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
  //searchForm:FormGroup;
  currentManager:AuthModel;
  deptLateReport:any = [];
  searchText:string;

  constructor(
    private fomrBuilder:FormBuilder,
    private employeeService:EmployeeService
    ) {
      this.currentManager = JSON.parse(localStorage.getItem('currentUser'));
      // this.searchForm = this.fomrBuilder.group({
      //   employeeName: [''],
      //   filterBy: [this.searchList[0]]
      // });
   }

  ngOnInit(): void {
    this.employeeService.getDeptLateReport(this.currentManager.username)
    .subscribe(data=>{
      this.deptLateReport = data;
      console.log(this.deptLateReport);
      this.deptLateReport.forEach(element => {
        this.getEmployeeLateReport(element);
      });
    })
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