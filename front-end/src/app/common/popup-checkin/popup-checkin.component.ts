import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalService } from '../modal.service';
import { AppServices } from '../../app.services';

import * as uuid from 'uuid';
import * as $ from 'jquery';
import { NotifyService } from '../../notify.service';
import { GridControlComponent } from '../grid-control/grid-control.component';
import { GridOption } from '../grid-control/grid-control';
import { AuthService } from '../../services/auth-service/auth.service';
@Component({
  selector: 'app-popup-checkin',
  templateUrl: './popup-checkin.component.html'
})
export class PopupCheckinComponent implements OnInit {
  modalId: string;
  @Output() onSelect = new EventEmitter<any>();
  @ViewChild('grid') gridItem: GridControlComponent;
  gridOption: GridOption;
  storerkey: string = '';

  constructor(private modalService: ModalService,
    private authService: AuthService,
    private notifyService: NotifyService) { }

  ngOnInit() {
    this.modalId = uuid.v4();
    this.initGrid();
  }

  initGrid() {
    this.gridOption = new GridOption();
    this.gridOption.height = 'calc(100vh - 250px)';
    this.gridOption.component = this;
    this.gridOption.key = "gridOption"
    this.gridOption.url = '/api/Checkins/find';
    this.gridOption.customFilter = (() => {
      return {
        'whseid': this.authService.user.whseid,
        'storerkey': this.storerkey,
        'staus': 'Check In',
        'deleted': false
      };
    })
    this.gridOption.commands = [{
      icon: 'fa fa-check text-success',
      click: this.select
    }];
    this.gridOption.columns = [{
      field: 'truckno',
      title: 'Truckno',
      type: 'string',
      width: '100px'
    },{
      field: 'fullname',
      title: 'Fullname',
      type: 'string',
      width: '100px'
    },{
      field: 'passportnumber',
      title: 'Passportnumber',
      type: 'string',
      width: '100px'
    },{
      field: 'container',
      title: 'Container',
      type: 'string',
      width: '100px'
    }];
  };

  select = (truckno) => {
    this.onSelect.emit(truckno);
    this.modalService.close(this.modalId);
  }

  open(param: any = {}) {
    this.storerkey = param.storerkey || '';
    this.gridItem.reload();
    this.modalService.open(this.modalId);
  }

  close() {
    this.modalService.close(this.modalId);
  }

  openModal(i, id, data) {
    this.modalService.open(this.modalId);
  }

  closeModal() {
    this.modalService.close(this.modalId);
  }
}
