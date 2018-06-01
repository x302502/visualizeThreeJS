import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';

import * as uuid from 'uuid';

import { ModalService } from '../modal.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { GridOption } from '../grid-control/grid-control';
import { GridControlComponent } from '../grid-control/grid-control.component';
import { API } from '../../services/api-service/api.resource';
@Component({
  selector: 'app-popup-pack',
  templateUrl: './popup-pack.component.html'
})
export class PopupPackComponent implements OnInit {
  @Output() onSelect = new EventEmitter<any>();

  @ViewChild('grid') grid: GridControlComponent;
  gridOption: GridOption;

  modalId = uuid.v4();

  constructor(private modalService: ModalService,
    private authService: AuthService) { }

  ngOnInit() {
  }

  initGrid() {
    this.gridOption = new GridOption();
    this.gridOption.height = 'calc(100vh - 250px)';
    this.gridOption.component = this;
    this.gridOption.key = 'PopupPackComponent';
    this.gridOption.url = API.PACK.FIND;
    this.gridOption.customFilter = { 'whseid': this.authService.user.whseid, 'deleted': false };
    this.gridOption.columns = [{
      field: 'packkey',
      title: 'PACKKEY',
      type: 'string',
      width: '100px'
    }, {
      field: 'packdescr',
      title: 'PACKDESCR',
      type: 'string',
      width: '100px'
    }, {
      field: 'qty',
      title: 'QUANTITY',
      type: 'string',
      width: '100px'
    }, {
      field: 'packuom3',
      title: 'MASTER UNIT',
      type: 'string',
      width: '100px'
    }, {
      field: 'iswhqty2',
      title: 'MASTER UINT ISDEFAULT',
      type: 'bool',
      width: '60px',
      trueValue: 'Default',
      falseValue: 'Not Default'
    }, {
      field: 'innerpack',
      title: 'QTY IN CASE',
      type: 'string',
      width: '100px'
    }, {
      field: 'packuom2',
      title: 'CASE UNIT',
      type: 'string',
      width: '100px'
    }, {
      field: 'iswhqty3',
      title: 'CASE UNIT ISDEFAULT',
      type: 'bool',
      width: '60px',
      trueValue: 'Default',
      falseValue: 'Not Default'
    }, {
      field: 'pallet',
      title: 'QTY IN PALLET',
      type: 'string',
      width: '100px'
    }, {
      field: 'packuom4',
      title: 'PALLET UNIT',
      type: 'string',
      width: '100px'
    }];
    // Events
    this.gridOption.onSelectRow = this.select;
  }

  select = (item) => {
    this.onSelect.emit(item);
    this.modalService.close(this.modalId);
  }

  openModal() {
    if (!this.grid) this.initGrid();
    else this.grid.reload();
    this.modalService.open(this.modalId);
  }

  closeModal() {
    this.modalService.close(this.modalId);
  }
}
