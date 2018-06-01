import { Component, OnInit, ViewChild } from '@angular/core';
import { ScheduleControlComponent } from '../../common/schedule-control/schedule-control.component';
import { ScheduleOption } from '../../common/schedule-control/shared/schedule-control.model';
import { v4 as uuid } from 'uuid';
import { EventObjectInput } from 'fullcalendar';

import * as $ from 'jquery';
import 'jquery';
// declare let $: any
@Component({
  selector: 'app-demo-schedule',
  templateUrl: './demo-schedule.component.html',
  styleUrls: ['./demo-schedule.component.css']
})
export class DemoScheduleComponent implements OnInit {
  @ViewChild('scheduleControl') schedule: ScheduleControlComponent;
  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    let current = new Date();
    let year = current.getFullYear();
    let month = current.getMonth();
    let date = current.getDate();
    let option: ScheduleOption = {
      events: [
        {
          id: uuid(),
          start: new Date(year, month, date, 7, 0),
          end: new Date(year, month, date, 9, 30),
          title: 'Item 1',
          backgroundColor: '#6ef441',
          tooltipItems: [
            {
              title: 'Customer name',
              value: 'Trần Thuận Nghĩa'
            },
            {
              title: 'Age',
              value: '27'
            },
            {
              title: 'Company',
              value: 'SuperDev'
            }
          ]
        },
        {
          id: uuid(),
          start: new Date(year, month, date, 10, 30),
          end: new Date(year, month, date, 12, 15),
          title: 'Item 2',
          backgroundColor: '#f4d041',
          tooltipItems: [
            {
              title: 'Customer name',
              value: 'Peter'
            },
            {
              title: 'Birthday',
              value: '22/08/1991'
            }
          ]
        }
      ]
    }
    this.schedule.draw(option);
  }

  addExternalEvent() {
    let externalEvent = {
      title: uuid(),
      data: {}
    };
    this.schedule.externalEvent.add(externalEvent);
  }

  addExternalEvents() {
    let externalEvents = [{
      title: uuid(),
      data: {}
    },
    {
      title: uuid(),
      data: {}
    },
    {
      title: uuid(),
      data: {}
    }];
    this.schedule.externalEvent.add(externalEvents);
  }

  click(date: Date) {
    console.log(date);
  }

  drop(event) {
    // event.date
    // event.data
    let next = new Date(event.date);
    next.setHours(next.getHours() + 1);
    this.schedule.renderEvent({
      id: uuid(),
      title: uuid(),
      start: event.date,
      end: next,
      backgroundColor: this.randomColor()
    })
  }

  clickEvent(event: EventObjectInput) {
    console.log(event.id);
    console.log(event.title);
    console.log(event.start);
    console.log(event.end);
  }

  updateEvent(event: EventObjectInput) {
    console.log(event.id);
    console.log(event.title);
    console.log(event.start);
    console.log(event.end);
  }

  private randomColor() {
    return '#' + (function co(lor) {
      return (lor +=
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)])
        && (lor.length == 6) ? lor : co(lor);
    })('');
  }
}
