import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalService } from '../modal.service';
import { AppServices } from '../../app.services';
import { UtilityService } from '../../services/utility-service/utility.service';
import { GridOption } from '../grid-control/grid-control';
import { GridControlComponent } from '../grid-control/grid-control.component';
import * as uuid from 'uuid';
import { API } from '../../services/api-service/api.resource';
@Component({
  selector: 'app-popup-zone',
  templateUrl: './popup-zone.component.html'
})
export class PopupZoneComponent implements OnInit {
  @Output() onSelect = new EventEmitter<any>();
  @ViewChild('grid') grid: GridControlComponent;
  gridOption: GridOption;
  modalId = uuid.v4();
  constructor(private modalService: ModalService,
    private appServices: AppServices,
    private utilityService: UtilityService) {
  }

  ngOnInit() {
    this.modalId = uuid.v4();
  }

  private initGrid() {
    this.gridOption = new GridOption();
    this.gridOption.height = 'calc(100vh - 250px)';
    this.gridOption.component = this;
    this.gridOption.key = 'PopupZoneComponent';
    this.gridOption.url = API.PUTAWAY_ZONE.FIND;
    this.gridOption.customFilter = { 'whseid': this.appServices.account.whseid, 'deleted': false };
    this.gridOption.columns = [{
      field: 'putawayzone',
      title: 'PutawayZone',
      type: 'string',
      width: '100px'
    }, {
      field: 'descr',
      title: 'Descr',
      type: 'string'
    }, {
      field: 'setdefault',
      title: 'isDefault',
      type: 'bool',
      width: '100px',
      trueValue: 'Default',
      falseValue: 'Not Default'
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
    this.modalService.open(this.modalId);
  }
  closeModal() {
    this.modalService.close(this.modalId);
  }

}
