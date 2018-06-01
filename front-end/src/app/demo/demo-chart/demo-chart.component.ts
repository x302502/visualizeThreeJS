import { Component, OnInit, ViewChild } from '@angular/core';
import { PieChartComponent } from '../../common/chart-control/pie-chart/pie-chart.component';
import { BarChartComponent } from '../../common/chart-control/bar-chart/bar-chart.component';
import { IDoughnutChartOption } from '../../common/chart-control/doughnut-chart/doughnut-chart.model';
import { ILineChartOption } from '../../common/chart-control/line-chart/line-chart.model';

@Component({
  selector: 'app-demo-chart',
  templateUrl: './demo-chart.component.html',
  styleUrls: ['./demo-chart.component.css']
})
export class DemoChartComponent implements OnInit {

  // @ViewChild('barChart') barChart: BarChartComponent;
  // @ViewChild('pieChart') pieChart: PieChartComponent;
  doughnutChartOption: IDoughnutChartOption;
  lineChartOption:ILineChartOption;
  constructor() { }

  ngOnInit() {
    this.doughnutChartOption = {
      title: 'Doughnut Chart',
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
    this.lineChartOption = {
      labels:['January', 'February', 'March', 'April', 'May', 'June', 'July'],
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
  }
  ngAfterViewInit() {


    // this.barChart.draw({
    //   width: 500,
    //   height:500,
    //   title: "DEMO BAR CHART",
    //   items:[{
    //     title: '<5',
    //     value: 2704659,
    //     color: "#ff8c00"
    //   }, {
    //     title: '5-13',
    //     value: 4499890,
    //     color: "#98abc5"
    //   },
    //   {
    //     title: '14-17',
    //     value: 2159981,
    //     color: "#8a89a6"
    //   },
    //   {
    //     title: '18-24',
    //     value: 3853788,
    //     color: "#7b6888"
    //   },
    //   {
    //     title: '25-44',
    //     value: 14106543,
    //     color: "#6b486b"
    //   },
    //   {
    //     title: '45-64',
    //     value: 8819342,
    //     color: "#a05d56"
    //   },
    //   {
    //     title: '≥65',
    //     value: 612463,
    //     color: "#d0743c"
    //   }],
    //   click: (data)=>{
    //     console.log(data);
    //   }
    // });
    // this.pieChart.draw({
    //   width: 500,
    //   height:500,
    //   title: "DEMO PIE CHART",
    //   items:[{
    //     title: '<5',
    //     value: 2704659,
    //     color: "#ff8c00"
    //   }, {
    //     title: '5-13',
    //     value: 4499890,
    //     color: "#98abc5"
    //   },
    //   {
    //     title: '14-17',
    //     value: 2159981,
    //     color: "#8a89a6"
    //   },
    //   {
    //     title: '18-24',
    //     value: 3853788,
    //     color: "#7b6888"
    //   },
    //   {
    //     title: '25-44',
    //     value: 14106543,
    //     color: "#6b486b"
    //   },
    //   {
    //     title: '45-64',
    //     value: 8819342,
    //     color: "#a05d56"
    //   },
    //   {
    //     title: '≥65',
    //     value: 612463,
    //     color: "#d0743c"
    //   }],
    //   click: (data)=>{
    //     console.log(data);
    //   }
    // });
  }

  randomValue() {
    return Math.round(Math.random() * 100);
  };
}
