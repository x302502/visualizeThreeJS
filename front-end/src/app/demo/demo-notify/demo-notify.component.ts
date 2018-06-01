import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../../notify.service';

@Component({
  selector: 'app-demo-notify',
  templateUrl: './demo-notify.component.html',
  styleUrls: ['./demo-notify.component.css']
})
export class DemoNotifyComponent implements OnInit {

  constructor(private notifyService: NotifyService) { }

  ngOnInit() {
  }
  info() {
    this.notifyService.info('This is info message');
  }

  success() {
    this.notifyService.success('This is success message');
  }

  warning() {
    this.notifyService.warning('This is warning message');
  }

  error() {
    this.notifyService.error('This is error message');
  }
}
