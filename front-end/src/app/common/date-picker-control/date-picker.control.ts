import { Component, OnInit, ViewChild, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import * as $ from 'jquery';
import * as Chart from 'chart.js';
import * as uuid from 'uuid';
import { NgbDateStruct, NgbTimepickerConfig, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'date-picker-control',
	templateUrl: './date-picker.control.html',
	styleUrls: ['./date-picker.control.css']
})
export class DatePickerControl implements OnInit {
	@Input() type: 'date' | 'datetime' = 'date';
	@Output() change = new EventEmitter();
	date: NgbDateStruct;
	hour: number;
	minute: number;
	@Input()
	set model(val) {
		setTimeout(() => {
			if (!val) { 
				if(val !== null) this.modelChange.emit(null);
			} else if (!(val instanceof Date)) {
				let date = new Date(val);
				this.modelChange.emit(date);
			} else {
				if (this.type === 'datetime') {
					this.hour = val.getHours();
					this.minute = val.getMinutes();
					this.date = { year: val.getFullYear(), month: val.getMonth() + 1, day: val.getDate() };
				} else {
					this.date = { year: val.getFullYear(), month: val.getMonth() + 1, day: val.getDate() };
				}
			}
		}, 0);
	}
	@Output() modelChange = new EventEmitter();

	constructor(private datePipe: DatePipe) {
	}

	ngOnInit() {
	}

	changeDate(val) {
		if(val) {
			this.date = val;
			if (this.type === 'datetime') {
				this.modelChange.emit(new Date(this.date.year, this.date.month - 1, this.date.day, this.hour, this.minute, 0));
			} else {
				this.modelChange.emit(new Date(this.date.year, this.date.month - 1, this.date.day));
			}
		} else {
			this.modelChange.emit(null);
		}
		this.change.emit();
	}

	changeHour(val) {
		this.hour = val;
		if (this.type === 'datetime') {
			this.modelChange.emit(new Date(this.date.year, this.date.month - 1, this.date.day, this.hour, this.minute, 0));
		} else {
			this.modelChange.emit(new Date(this.date.year, this.date.month - 1, this.date.day));
		}
		this.change.emit();
	}

	changeMinute(val) {
		this.minute = val;
		if (this.type === 'datetime') {
			this.modelChange.emit(new Date(this.date.year, this.date.month - 1, this.date.day, this.hour, this.minute, 0));
		} else {
			this.modelChange.emit(new Date(this.date.year, this.date.month - 1, this.date.day));
		}
		this.change.emit();
	}
}