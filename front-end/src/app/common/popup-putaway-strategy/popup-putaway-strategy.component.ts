import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalService } from '../modal.service';

import { UtilityService } from '../../services/utility-service/utility.service';
import * as uuid from 'uuid';
import * as $ from 'jquery';
import { NotifyService } from '../../notify.service';
import { GridControlComponent } from '../grid-control/grid-control.component';
import { GridOption } from '../grid-control/grid-control';
import { API } from '../../services/api-service/api.resource';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-popup-putaway-strategy',
  templateUrl: './popup-putaway-strategy.component.html'
})
export class PopupPutawayStrategyComponent implements OnInit {
  modalId: string;
  @Output() onSelect = new EventEmitter<any>();
  @ViewChild('grid') grid: GridControlComponent;
  gridOption: GridOption;

  constructor(private modalService: ModalService,
    private notifyService: NotifyService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.modalId = uuid.v4();
  }

  initGrid() {
    this.gridOption = new GridOption();
    this.gridOption.height = 'calc(100vh - 250px)';
    this.gridOption.component = this;
    this.gridOption.key = 'PopupPutawayStrategyComponent';
    this.gridOption.url = API.PUTAWAY_STRATEGY.FIND;
    this.gridOption.customFilter = (() => {
      return {
        'whseid': this.authService.user.whseid,
        'deleted': false
      };
    });
    this.gridOption.columns = [{
      field: 'putawaystrategykey',
      title: 'Code',
      type: 'string',
      width: '100px'
    }, {
      field: 'descr',
      title: 'Description',
      type: 'string',
      width: ''
    }];
    // Events
    this.gridOption.onSelectRow = this.select;
  };

  select = (data) => {
    this.onSelect.emit(data);
    this.modalService.close(this.modalId);
  }

  open(param: any = {}) {
    if (!this.grid) this.initGrid();
    else this.grid.reload();
    this.modalService.open(this.modalId);
  }

  close() {
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
