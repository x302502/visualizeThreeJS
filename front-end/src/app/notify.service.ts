import { Injectable } from '@angular/core';
import * as jQuery from 'jquery';
import swal from 'sweetalert2';
declare var $: any;

@Injectable()
export class NotifyService {
  constructor() {

  }

  private notify(html) {
    if (!jQuery('#superdev-notify').length) {
      jQuery('body').append(html);
      jQuery('#superdev-notify').slideDown(500);
      setTimeout(() => {
        jQuery('#superdev-notify').slideUp(500);
        setTimeout(() => {
          jQuery('#superdev-notify').remove();
        }, 500);
      }, 3000);
    }
  }

  info(message: string) {
    let html = `<div id="superdev-notify" class="notify-info"><i class="fa fa-info-circle"></i> ${message}</div>`;
    this.notify(html);
  }

  success(message: string) {
    let html = `<div id="superdev-notify" class="notify-success"><i class="fa fa-check"></i> ${message}</div>`;
    this.notify(html);
  }

  error(message: string) {
    let html = `<div id="superdev-notify" class="notify-error"><i class="fa fa-times-circle"></i> ${message}</div>`;
    this.notify(html);
  }

  warning(message: string) {
    let html = `<div id="superdev-notify" class="notify-warning"><i class="fa fa-warning"></i> ${message}</div>`;
    this.notify(html);
  }

  confirm(message: string, title?: string) {
    return new Promise(resolve => {
      swal({
        title: title || 'Confirmation',
        html: message,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then(result => {
        if (result.value) resolve();
      });
    });
  }

  confirmDelete(message?: string, title?: string) {
    return new Promise(resolve => {
      this.confirm(`Do you want to delete <strong class="text-warning">${message || 'this record'}</strong>`, title)
        .then(() => {
          resolve();
        });
    });
  }

  show(message, type = 'info', icon = 'fa fa-info-circle', title = '', url = '') {
    $.notify({
      title: title,
      message: message,
      icon: icon,
      url: url
    }, {
        allow_dismiss: true,
        showProgressbar: false,
        type: type,
        placement: {
          from: "bottom",
          align: "right"
        },
        delay: 300,
        timer: 100,
      });
  }
  confirmWithInput(title: string){
    let input = '';
    return new Promise((resolve)=>{
      swal({
        title: title,
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Accept',
        showLoaderOnConfirm: true,
        preConfirm: (value) => {
          input = value;
        },
        allowOutsideClick: () => !swal.isLoading()
      }).then((result) => {
        if (result.value) {
          resolve(input);
        }
      })
    });    
  }
}
