import { Component, OnInit } from '@angular/core';
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
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {

  public pieLegend:any = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'Punctual vs Late',
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
          name: 'Chrome',
          y: 60,
          sliced: true,
          selected: true
        }, 
        {
          name: 'Internet Explorer',
          y: 40
        }
      ]
    }]
  }
  
  // public pieSemiCircle:any = {
  //   chart: {
  //     plotBackgroundColor: null,
  //     plotBorderWidth: 0,
  //     plotShadow: false
  //   },
  //   title: {
  //       text: 'Annual vs Medical Leave Applied',
  //       style: {
  //         fontWeight: 'bold'
  //       }
  //   },
  //   tooltip: {
  //       pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  //   },
  //   accessibility: {
  //       point: {
  //           valueSuffix: '%'
  //       }
  //   },
  //   plotOptions: {
  //       pie: {
  //           dataLabels: {
  //               enabled: true,
  //               distance: -50,
  //               style: {
  //                   fontWeight: 'bold',
  //                   color: 'white'
  //               }
  //           },
  //           startAngle: -90,
  //           endAngle: 90,
  //           center: ['50%', '75%'],
  //           size: '110%'
  //       }
  //   },
  //   series: [{
  //       type: 'pie',
  //       name: 'Browser share',
  //       innerSize: '50%',
  //       data: [
  //           ['Chrome', 58.9],
  //           ['Firefox', 13.29],
  //           ['Internet Explorer', 13],
  //           ['Edge', 3.78],
  //           ['Safari', 3.42],
  //           {
  //               name: 'Other',
  //               y: 7.61,
  //               dataLabels: {
  //                   enabled: false
  //               }
  //           }
  //       ]
  //   }]
  // }

  public varRadiusPie:any = {
    chart: {
      type: 'variablepie'
    },
    title: {
      text: 'Annual & Medical Leave Applied',
      style: {
        fontWeight: 'bold'
      }
    },
    tooltip: {
        headerFormat: '',
        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
            'Area (square km): <b>{point.y}</b><br/>' +
            'Population density (people per square km): <b>{point.z}</b><br/>'
    },
    series: [{
      minPointSize: 10,
      innerSize: '40%',
      zMin: 0,
      name: 'countries',
      data: [{
        name: 'Annual Leave',
        y: 505370,
        z: 92.9
      }, 
      {
        name: 'Medical Leave',
        y: 551500,
        z: 118.7
      }]
    }]
  }

  constructor() { }

  ngOnInit(): void {
    Highcharts.chart('pie-legend',this.pieLegend);
    //Highcharts.chart('semi-pie',this.pieSemiCircle);
    Highcharts.chart('var-radius-pie',this.varRadiusPie);
  }

}
