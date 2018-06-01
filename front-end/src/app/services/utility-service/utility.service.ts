import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import * as md5 from 'md5';
import { NotifyService } from '../../notify.service';
@Injectable()
export class UtilityService {
  constructor(private notifyService: NotifyService) {

  }
  hash(key: string) {
    return md5(key);
  }
  handleError(err) {
    if (typeof (err) === 'string') {
      this.notifyService.error(err);
    } else if (typeof (err) === 'object') {
      let message = err.message || 'UNKNOWN_ERROR';
      if (err.json && typeof (err.json) === 'function') {
        message = err.json().message || message;
        if(err.json().error) message = err.json().error.message || message;
      }
      this.notifyService.error(message);
    } else {
      console.log(err);
      this.notifyService.error('UNKNOWN_ERROR');
    }
  }
}