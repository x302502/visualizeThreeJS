import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import * as Chart from 'chart.js';
import * as uuid from 'uuid';

import { ILineChartOption } from './line-chart.model';
import { Colors } from '../chart.model';
@Component({
  selector: 'line-chart-control',
  templateUrl: './line-chart.component.html',
  styleUrls: ['../chart.control.css']
})
export class LineChartControl implements OnInit {
	
	@Input() option: ILineChartOption;
	collapsed: boolean = false;
  id = uuid.v4();
  constructor() { }
  ngOnInit() {
  }

  ngAfterViewInit() {
    let config = {
			type: 'line',
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
