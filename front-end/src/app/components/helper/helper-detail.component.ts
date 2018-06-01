import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { PasteService } from './../../paste.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { DatePipe } from '@angular/common';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import * as uuid from 'uuid';
import * as $ from 'jquery';
import 'bootstrap';
import { DynamicComponent } from '../../common/dynamic-loader/dynamic-loader.model';
import { SocketService } from '../../services/socket.service';
import { UtilityService } from '../../services/utility-service/utility.service';
declare var CKEDITOR: any;
@Component({
  selector: 'app-helper-detail',
  templateUrl: './helper-detail.component.html'
})
export class HelperDetailComponent implements OnInit, DynamicComponent {
  tabReload: EventEmitter<any> = new EventEmitter();
  entity: any;
  id = {
    ckEditor: uuid.v4()
  };
  constructor(private router: Router,
    private appServices: AppServices,
    private notifyService: NotifyService,
    private utilityService: UtilityService,
    private pasteService: PasteService,
    private datepipe: DatePipe,
    private completerService: CompleterService,
    private socketService: SocketService) {

    this.tabReload.subscribe(data => {
      if (data) this.entity = Object.assign({}, data);
      else this.entity = {};
      if (CKEDITOR.instances[this.id.ckEditor]) CKEDITOR.instances[this.id.ckEditor].setData(this.entity.description);
      else {
        setTimeout(() => {
          if (CKEDITOR.instances[this.id.ckEditor]) CKEDITOR.instances[this.id.ckEditor].setData(this.entity.description);
        }, 1000);
      }
    });
  }
  ngOnInit() {
  }

  ngAfterViewInit() {
    CKEDITOR.replace(this.id.ckEditor);
  }

  save() {
    if (this.entity.addwho) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert() {
    let content = CKEDITOR.instances[this.id.ckEditor].getData();
    this.entity['description'] = content;
    this.entity['currentuser'] = this.appServices.account.username;
    this.appServices.insertHelp({ "obj": JSON.stringify(this.entity) }, this)
      .then(__ => {
        this.notifyService.success('Process Done');
        this.entity = __.response.json().res;
        this.socketService.send({
          code: "HELPER_CREATE",
          data: this.entity
        });
      }).catch((err) => {
        this.utilityService.handleError(err);
      });
  }
  update() {
    let content = CKEDITOR.instances[this.id.ckEditor].getData();
    this.entity['description'] = content;
    this.entity['currentuser'] = this.appServices.account.username;
    this.appServices.updateHelp({ 'obj': JSON.stringify(this.entity) }, this)
      .then(__ => {
        this.notifyService.success('Process Done');
        this.entity = __.response.json().res;
        this.socketService.send({
          code: "HELPER_UPDATE",
          data: this.entity
        });
      }).catch((err) => {
        this.utilityService.handleError(err);
      });
  }
}
