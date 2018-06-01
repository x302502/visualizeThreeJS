import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalService } from '../modal.service';
import { AppServices } from '../../app.services';

import * as uuid from 'uuid';
import * as $ from 'jquery';
import { NotifyService } from '../../notify.service';
import { GridControlComponent } from '../grid-control/grid-control.component';
import { GridOption } from '../grid-control/grid-control';
import { API } from '../../services/api-service/api.resource';

@Component({
  selector: 'app-popup-shipcode',
  templateUrl: './popup-shipcode.component.html'
})
export class PopupShipcodeComponent implements OnInit {
  modalId: string;
  @Output() onSelect = new EventEmitter<any>();
  @ViewChild('grid') grid: GridControlComponent;
  gridOption: GridOption;
  storerkey: string = '';

  constructor(private modalService: ModalService,
    private appServices: AppServices,
    private notifyService: NotifyService) { }

  ngOnInit() {
    this.modalId = uuid.v4();
  }

  initGrid() {
    console.log(this.storerkey);

    this.gridOption = new GridOption();
    this.gridOption.height = 'calc(100vh - 250px)';
    this.gridOption.component = this;
    this.gridOption.key = 'PopupShipcodeComponent';
    this.gridOption.url = API.SHIPCODE.FIND;
    this.gridOption.customFilter = (() => {
      return {
        'whseid': this.appServices.account.whseid,
        'storerkey': this.storerkey,
        'deleted': false
      };
    });

    this.gridOption.columns = [{
      field: 'shipcode',
      title: 'SHIPCODE',
      type: 'string',
      width: '100px'
    }, {
      field: 'address',
      title: 'ADDRESS',
      type: 'string',
      width: '100px'
    }];
    this.gridOption.onSelectRow = this.select;
  };

  select = (shipcode) => {
    this.onSelect.emit(shipcode);
    this.modalService.close(this.modalId);
  }

  open = (param: any = {}) => {
    this.storerkey = param.storerkey || '';
    if (!this.grid) this.initGrid();
    else this.grid.reload();
    this.modalService.open(this.modalId);
  }

  close() {
    this.modalService.close(this.modalId);
  }

  openModal() {
    this.modalService.open(this.modalId);
  }

  closeModal() {
    this.modalService.close(this.modalId);
  }
}
