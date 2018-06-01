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
  selector: 'app-popup-sku',
  templateUrl: './popup-sku.component.html'
})
export class PopupSKUComponent implements OnInit {
  modalId: string;
  @Output() onSelect = new EventEmitter<any>();
  @ViewChild('grid') gridItem: GridControlComponent;
  gridOption: GridOption;
  storerkey: string = '';

  constructor(private modalService: ModalService,
    private appServices: AppServices,
    private notifyService: NotifyService) { }

  ngOnInit() {
    this.modalId = uuid.v4();
    this.initGrid();
  }

  initGrid() {
    this.gridOption = new GridOption();
    this.gridOption.height = 'calc(100vh - 250px)';
    this.gridOption.component = this;
    this.gridOption.key = 'PopupSKUComponent';
    this.gridOption.url = API.SKU.FIND;
    this.gridOption.customFilter = (() => {
      return {
        'whseid': this.appServices.account.whseid,
        'storerkey': this.storerkey,
        'deleted': false
      };
    });

    this.gridOption.columns = [{
      field: 'storerkey',
      title: 'STORERKEY',
      type: 'string',
      width: '100px'
    }, {
      field: 'sku',
      title: 'SKU',
      type: 'string',
      width: '100px'
    }, {
      field: 'packkey',
      title: 'PACKKEY',
      type: 'string',
      width: '100px'
    }, {
      field: 'stdgrosswgt',
      title: 'STDGROSSWGT',
      type: 'number',
      width: '80px'
    }, {
      field: 'stdnetwgt',
      title: 'STDNETWGT',
      type: 'number',
      width: '80px'
    }, {
      field: 'stdcube',
      title: 'STDCUBE',
      type: 'number',
      width: '80px'
    }, {
      field: 'strategykey',
      title: 'STRATEGYKEY',
      type: 'string',
      width: '100px'
    }, {
      field: 'putawaystrategykey',
      title: 'PUTAWAYSTRATEGYKEY',
      type: 'string',
      width: '100px'
    }, {
      field: 'putawayzone',
      title: 'PUTAWAYZONE',
      type: 'string',
      width: ''
    }];
    // Events
    this.gridOption.onSelectRow = this.select;
  };

  select = (sku) => {
    this.onSelect.emit(sku);
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

  openModal() {
    this.modalService.open(this.modalId);
  }

  closeModal() {
    this.modalService.close(this.modalId);
  }
}
