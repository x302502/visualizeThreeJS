import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as $ from 'jquery';
import * as Chart from 'chart.js';
import * as uuid from 'uuid';

import { IBarChartOption } from './bar-chart.model';
import { Colors } from '../chart.model';
@Component({
  selector: 'bar-chart-control',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['../chart.control.css']
})
export class BarChartComponent implements OnInit {
	@Input() option: IBarChartOption;
	collapsed: boolean = false;
  id = uuid.v4();
  constructor() { }
  ngOnInit() {
  }

  ngAfterViewInit() {
    let config = {
			type: 'bar',
			data: {
				labels: this.option.labels,
        datasets: this.option.datasets.map((dataset, index)=>{
          return {
            fill: false,
            label: dataset.label,
            backgroundColor: dataset.color || Colors[index],
            borderColor: dataset.color || Colors[index],
            data: dataset.data
          }
        }),
			},
			options: {
				responsive: true,
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: this.option.xTitle || 'x'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: this.option.yTitle || 'y'
						}
					}]
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