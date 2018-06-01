import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { Moment, MomentInput } from 'moment';
import { EventObjectInput } from 'fullcalendar';

import { ScheduleEvent, ScheduleOption, ScheduleTooltipInfo, ScheduleExternalEvent } from './shared/schedule-control.model';
import * as $ from 'jquery';
import 'fullcalendar';
import 'jqueryui';
@Component({
  selector: 'schedule-control',
  templateUrl: './schedule-control.component.html',
  styleUrls: ['./schedule-control.component.css']
})
export class ScheduleControlComponent implements OnInit {
  @Output() onClick = new EventEmitter<Date>();
  @Output() onDrop = new EventEmitter<any>();
  @Output() onClickEvent = new EventEmitter<any>();
  @Output() onUpdateEvent = new EventEmitter<any>();

  @ViewChild('control') controlRef: ElementRef;
  @ViewChild('tooltip') tooltipRef: ElementRef;

  private control: JQuery<HTMLElement>;

  private tooltip: JQuery<HTMLElement>;

  tooltipInfo: ScheduleTooltipInfo = new ScheduleTooltipInfo();
  private option: ScheduleOption;

  externalEvents: ScheduleExternalEvent[] = [];

  constructor() {
  }

  ngOnInit() {
    this.control = $(this.controlRef.nativeElement);
    this.tooltip = $(this.tooltipRef.nativeElement);
  }

  ngAfterViewInit() {
    this.tooltip.appendTo('body');
  }

  ngOnDestroy() {
    // Remove tooltip
    this.tooltip.remove();
  }

  /** Draw schedule */
  draw(option: ScheduleOption) {
    this.option = option;
    let that = this;
    this.control.empty();
    this.control.fullCalendar({
      // Properties
      editable: true,
      droppable: true,
      dragRevertDuration: 0,
      header: {
        right: 'month,agendaWeek,agendaDay', // buttons for switching between views
        left: 'today prev,next'
      },
      events: option.events,
      eventOverlap: false,
      // Events
      drop: function (moment: Moment, jsEvent: MouseEvent, ui) {
        that.onDrop.emit({
          date: that.momentToDate(moment),
          data: $(this).data('external')
        });
      },
      dayClick: (moment: Moment) => {
        this.onClick.emit(this.momentToDate(moment));
      },
      eventMouseover: function (event, jsEvent, view) {
        // Set tooltip data
        that.tooltipInfo.title = event.title;
        that.tooltipInfo.start = that.momentToTimeString(event.start as Moment);
        that.tooltipInfo.end = that.momentToTimeString(event.end as Moment);
        that.tooltipInfo.items = that.option.events.find(e => e.id === event.id).tooltipItems;

        if (that.tooltipInfo.items) {
          // Set tooltip position
          that.tooltip.css('top', jsEvent.clientY + 20);
          that.tooltip.css('left', jsEvent.clientX - 170);
          // Show tooltip
          that.tooltip.fadeIn('fast');
        }

        $(this).on('mousemove', function (e) {
          that.tooltip.css('top', e.clientY + 20);
          that.tooltip.css('left', e.clientX - 170);
        });
      },
      eventMouseout: function () {
        // Hide tooltip
        that.tooltip.fadeOut('fast');
        $(this).off('mousemove');
      },
      eventClick: (event: EventObjectInput) => {
        // event.id, event.title, event.start, event.end
        this.onClickEvent.emit({
          id: event.id,
          title: event.title,
          start: this.momentToDate(event.start),
          end: this.momentToDate(event.end)
        });
      },
      eventDrop: (event: EventObjectInput) => {
        // event.id, event.title, event.start, event.end
        this.onUpdateEvent.emit({
          id: event.id,
          title: event.title,
          start: this.momentToDate(event.start),
          end: this.momentToDate(event.end)
        });
      },
      eventResize: (event: EventObjectInput) => {
        // event.id, event.title, event.start, event.end
        this.onUpdateEvent.emit({
          id: event.id,
          title: event.title,
          start: this.momentToDate(event.start),
          end: this.momentToDate(event.end)
        });
      }
    })
    this.resize();
  }

  private resize() {
    setTimeout(() => {
      let top = this.control.offset().top;
      this.control.height(`${$(window).height() - top}px`);
      this.control.fullCalendar('option', 'height', $(window).height() - top);
    }, 1000);
  }

  externalEvent = {
    add: (event: ScheduleExternalEvent | ScheduleExternalEvent[]) => {
      let that = this;
      if (event instanceof Array) {
        event.forEach(item => {
          this.externalEvents.push(item);
        });
      } else {
        this.externalEvents.push(event);
      }
      setTimeout(() => {
        $('.external-events .fc-event').each(function (index) {
          // store data so the calendar knows to render an event upon drop
          $(this).data('external', that.externalEvents[index].data);
          // make the event draggable using jQuery UI
          $(this).draggable({
            zIndex: 999,
            revert: true,      // will cause the event to go back to its
            revertDuration: 0  //  original position after the drag
          });
        });
        let top = this.control.offset().top;
        $('#aa').css('max-height', $(window).height() - top);
      }, 1000);
    },
    clear: () => {
      this.externalEvents = [];
    }
  }

  /** Draw new event */
  renderEvent(event: ScheduleEvent) {
    this.option.events.push(event);
    this.control.fullCalendar('renderEvent', event);
  }

  /** Convert Moment to String with format 'HH:mm' */
  private momentToTimeString(moment: Moment) {
    let hour = (`0${moment.hour()}`).slice(-2);
    let minute = (`0${moment.minute()}`).slice(-2);
    return `${hour}:${minute}`;
  }

  /** Convert Moment to DateTime */
  private momentToDate(moment: any) {
    if (moment instanceof Date) return moment;
    if (typeof (moment) == 'string') return new Date(moment);
    if (typeof (moment) == 'number') return new Date(moment);
    return new Date(moment.year(), moment.month(), moment.date(), moment.hour(), moment.minute(), moment.millisecond());
  }
}
