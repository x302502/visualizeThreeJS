import { Component, OnInit, Output, Input, ElementRef, EventEmitter } from '@angular/core';
import { VisualizeComponent } from '../visualize.component';
import * as uuid from 'uuid';
import * as $ from 'jquery';
import { InputModal, DataModal } from '../../../common/models';
@Component({
  selector: 'app-poup-visualize',
  templateUrl: './poup-visualize.component.html',
  styleUrls: ['./poup-visualize.component.css']
})
export class PoupVisualizeComponent implements OnInit {
  @Input() modalId: string;
  @Input() dataModal: DataModal;
  @Output() myClick = new EventEmitter<DataModal>();
  constructor() {
  }
  ngOnInit() {
  }
  open() {
    $(`#${this.modalId}`).modal('show');
  }
  setData() {
    this.myClick.emit(this.dataModal);
    this.close()
  }
  close() {
    $(`#${this.modalId}`).modal('hide');
  }
}
