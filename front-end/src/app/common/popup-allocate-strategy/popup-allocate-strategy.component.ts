import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';

import * as uuid from 'uuid';

import { ModalService } from '../modal.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { GridOption } from '../grid-control/grid-control';
import { GridControlComponent } from '../grid-control/grid-control.component';
import { API } from '../../services/api-service/api.resource';
@Component({
  selector: 'app-popup-allocate-strategy',
  templateUrl: './popup-allocate-strategy.component.html'
})
export class PopupAllocateStrategyComponent implements OnInit {
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
    this.gridOption.key = 'AllocateListComponent';
    this.gridOption.url = '/api/Allocatestrategies/find';
    this.gridOption.customFilter = { 'whseid': this.authService.user.whseid, 'deleted': false };

    this.gridOption.columns = [{
      field: 'allocatestrategykey',
      title: 'Code',
      type: 'string',
      width: '150px'
    }, {
      field: 'descr',
      title: 'Description',
      type: 'string',
      width: ''
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
