import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as $ from 'jquery';
import * as Chart from 'chart.js';
import { IDoughnutChartOption } from './doughnut-chart.model';
import * as uuid from 'uuid';

import { Colors } from '../chart.model';
@Component({
  selector: 'doughnut-chart-control',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['../chart.control.css']
})
export class DoughnutChartControl implements OnInit {
  @Input() option: IDoughnutChartOption;
  collapsed: boolean = false;
  id = uuid.v4();
  constructor() { }
  ngOnInit() {
  }

  ngAfterViewInit() {
    let config: Chart.ChartConfiguration = {
      type: 'doughnut',
      data: {
        datasets: [{
          data: this.option.items.map(item=>item.value),
          backgroundColor: this.option.items.map((item, index)=>item.color || Colors[index]),
          label: this.option.title
        }],
        labels: this.option.items.map(item=>item.title),
      },
      options: {
        responsive: true,
        legend: {
          position: 'top',
        }
      }
    };
    let ctx = document.getElementById(this.id).getContext('2d');
    window.myDoughnut = new Chart(ctx, config);
  }

  @ViewChild('boxBody') boxBody: ElementRef;
	toggle(){
		$(this.boxBody.nativeElement).slideToggle('slow');
	}
}
