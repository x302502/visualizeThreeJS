import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';

import * as uuid from 'uuid';

import { ModalService } from '../modal.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { GridOption } from '../grid-control/grid-control';
import { GridControlComponent } from '../grid-control/grid-control.component';
import { API } from '../../services/api-service/api.resource';

@Component({
  selector: 'app-popup-location',
  templateUrl: './popup-location.component.html'
})
export class PopupLocationComponent implements OnInit {
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
    this.gridOption.key = 'PopupLocationComponent';
    this.gridOption.url = API.LOCATION.FIND;
    this.gridOption.onSelectRow = this.select;
    this.gridOption.customFilter = { 'whseid': this.authService.user.whseid, 'deleted': false };
    this.gridOption.columns = [{
      field: 'loc',
      title: 'LOCATION',
      type: 'string'
    }, {
      field: 'status',
      title: 'STATUS',
      type: 'string',
      width: '100px'
    }, {
      field: 'putawayzone',
      title: 'PUTAWAYZONE',
      type: 'string',
      width: '100px'
    }, {
      field: 'stacklimit',
      title: 'STACKLIMIT',
      type: 'string',
      width: '100px'
    }, {
      field: 'logicallocation',
      title: 'LOGICAL LOCATION',
      type: 'string',
      width: '100px'
    }, {
      field: 'comminglesku',
      title: 'COMMINGLESKU',
      type: 'bool',
      width: '80px',
      trueValue: 'Active',
      falseValue: 'InActive'
    }, {
      field: 'comminglelot',
      title: 'COMMINGLELOT',
      type: 'bool',
      width: '80px',
      trueValue: 'Active',
      falseValue: 'InActive'
    }];
    // Events
    this.gridOption.onSelectRow = this.select;
  }

  select = (data) => {
    this.onSelect.emit(data);
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
