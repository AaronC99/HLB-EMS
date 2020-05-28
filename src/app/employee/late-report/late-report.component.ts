import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as Highcharts from 'highcharts';
import Variablepie from 'highcharts/modules/variable-pie';

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
  searchForm:FormGroup;
  public pieLegend:any = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: '(Employee Name)',
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
      name: 'Brands',
      colorByPoint: true,
      data: [
        {
          name: 'On Time',
          y: 75,
          sliced: true,
          selected: true
        }, 
        {
          name: 'Late',
          y: 25
        }
      ]
    }]
  }

  constructor(private fomrBuilder:FormBuilder) {
    this.searchForm = this.fomrBuilder.group({
      employeeName: [''],
      filterBy: [this.searchList[0]]
    });
   }

  ngOnInit(): void {
    Highcharts.chart('pie',this.pieLegend);
  }

}
