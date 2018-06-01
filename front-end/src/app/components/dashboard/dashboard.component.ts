import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';

import * as $ from 'jquery';
import 'bootstrap';
import { PieChartComponent } from '../../common/chart-control/pie-chart/pie-chart.component';
import { IDoughnutChartOption } from '../../common/chart-control/doughnut-chart/doughnut-chart.model';
import { ILineChartOption } from '../../common/chart-control/line-chart/line-chart.model';
import { IBarChartOption } from '../../common/chart-control/bar-chart/bar-chart.model';
import { DynamicComponent, DynamicTabItem } from '../../common/dynamic-loader/dynamic-loader.model';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements DynamicComponent {
  //#region Dynamic Component
  tabEmitter: EventEmitter<DynamicTabItem> = new EventEmitter();
  tabReload: EventEmitter<any> = new EventEmitter();
  //#endregion
  
  constructor(private appServices: AppServices,
    private notifyService: NotifyService) { }
  doughnutChart1: IDoughnutChartOption;
  doughnutChart2: IDoughnutChartOption;
  lineChart1: ILineChartOption;
  lineChart2: ILineChartOption;
  barChart1: IBarChartOption;
  barChart2: IBarChartOption;
  ngOnInit() {
    this.doughnutChart1 = {
      title: 'Doughnut Chart 1',
      items: [
        {
          title: 'Title 1',
          value: this.randomValue()
        },
        {
          title: 'Title 2',
          value: this.randomValue()
        },
        {
          title: 'Title 3',
          value: this.randomValue()
        }
      ]
    };

    this.doughnutChart2 = {
      title: 'Doughnut Chart 2',
      items: [
        {
          title: 'Title 1',
          value: this.randomValue()
        },
        {
          title: 'Title 2',
          value: this.randomValue()
        },
        {
          title: 'Title 3',
          value: this.randomValue()
        },
        {
          title: 'Title 4',
          value: this.randomValue()
        },
        {
          title: 'Title 5',
          value: this.randomValue()
        }
      ]
    };

    this.lineChart1 = {
      title: 'Line chart 1',
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        label: 'My First dataset',
        data: [
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
        ]
      }, {
        label: 'My Second dataset',
        data: [
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
        ],
      }]
    }

    this.lineChart2 = {
      title: 'Line chart 2',
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        label: 'My First dataset',
        data: [
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
        ]
      }, {
        label: 'My Second dataset',
        data: [
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
        ],
      }, {
        label: 'My Third dataset',
        data: [
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
        ],
      }]
    }

    this.barChart1 = {
      title: 'Bar chart 1',
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        label: 'My First dataset',
        data: [
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
        ]
      }, {
        label: 'My Second dataset',
        data: [
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
        ],
      }]
    }

    this.barChart2 = {
      title: 'Bar chart 2',
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        label: 'My First dataset',
        data: [
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
        ]
      }, {
        label: 'My Second dataset',
        data: [
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
        ],
      }, {
        label: 'My Third dataset',
        data: [
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
          this.randomValue(),
        ],
      }]
    }
  }
  randomValue() {
    return Math.round(Math.random() * 100);
  };
}
