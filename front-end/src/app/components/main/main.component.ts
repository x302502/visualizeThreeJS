import { Component, OnInit, ChangeDetectorRef, QueryList, ElementRef, ViewChildren, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';
import * as md5 from 'md5';
import * as uuid from 'uuid';
import * as $ from 'jquery';
import { AppServices } from '../../app.services';
import { NotifyService } from '../../notify.service';
import { DynamicTabItem, DynamicComponent } from '../../common/dynamic-loader/dynamic-loader.model';
import { DynamicLoaderDirective } from '../../common/dynamic-loader/dynamic-loader.directive';
import { menu } from './menu-resources';
import { SocketService, ISocketData } from '../../services/socket.service';
import { LanguageService } from '../../services/language-service/language.service';
import { ConfigService } from '../../services/config-service/config.service';
import { UtilityService } from '../../services/utility-service/utility.service';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  //#region A
  menu = menu;
  warehouses: {
    id: number;
    parentuser: string;
    warehousecode: string;
    warehousename: string
  }[] = [];
  tabs: DynamicTabItem[] = [];
  changeType: 'add' | 'remove';
  dynamicComponents: DynamicComponent[] = [];
  @ViewChildren(DynamicLoaderDirective) private dynamicLoaders: QueryList<DynamicLoaderDirective>;
  @ViewChildren('tabElement') private tabElements: QueryList<ElementRef>;
  //#endregion

  data_currentuser; isChangePassword = false;

  // Logo
  logoUrl: string;
  // Language
  languageData: any;
  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private appServices: AppServices,
    public authService: AuthService,
    private notifyService: NotifyService,
    public languageService: LanguageService,
    private socketService: SocketService,
    private configService: ConfigService,
    private utilityService: UtilityService) {
    this.logoUrl = this.configService.clientConfig.image.logo;
  }

  ngOnInit() {
    this.languageData = this.languageService.load('MainComponent');
    this.warehouses = this.authService.user.warehouses;
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    // subcribe khi có sự thay đổi tab
    this.dynamicLoaders.changes.subscribe((dynamicLoaders) => {
      // nếu là thêm tab mới
      if (this.changeType === 'add') {
        let idx = this.tabs.length - 1;
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.tabs[idx].component);
        let viewContainerRef = this.dynamicLoaders.find((dynamicLoader, index) => index == idx).viewContainerRef;
        viewContainerRef.clear();
        setTimeout(() => {
          let componentRef = viewContainerRef.createComponent(componentFactory);
          let dynamicComponent = (<DynamicComponent>componentRef.instance);
          this.dynamicComponents.push(dynamicComponent);
          if (dynamicComponent.tabReload) {
            dynamicComponent.tabReload.emit(this.tabs[idx].data);
          }
          if (dynamicComponent.tabEmitter) {
            let subcription = dynamicComponent.tabEmitter.subscribe((dynamicTabItem: DynamicTabItem) => {
              this.openTab(dynamicTabItem);
            });
          }
        }, 0);
      }
    });

    this.tabElements.changes.subscribe(() => {
      if (this.changeType === 'add') {
        $(this.tabElements.toArray()[this.tabElements.length - 1].nativeElement).tab('show');
      } else if (this.changeType === 'remove') {
        if (this.tabElements.length) {
          $(this.tabElements.toArray()[this.tabElements.length - 1].nativeElement).tab('show');
        }
      }
    });
  }
  openTab(dynamicTabItem: DynamicTabItem) {
    // kiểm tra đã có tab nào load component đó chưa
    let idx = this.tabs.findIndex(tab => tab.component == dynamicTabItem.component);
    if (idx < 0) {
      this.changeType = 'add';
      this.tabs.push({
        id: uuid.v4(),
        title: dynamicTabItem.title,
        component: dynamicTabItem.component,
        data: dynamicTabItem.data
      });
    } else {
      // ngoài ra, emit data mới vào tabReload
      if (this.dynamicComponents[idx].tabReload) {
        this.dynamicComponents[idx].tabReload.emit(dynamicTabItem.data);
      }
      $(this.tabElements.toArray()[idx].nativeElement).tab('show');
    }
  }
  closeTab(tab: DynamicTabItem) {
    this.changeType = 'remove';
    let index = this.tabs.indexOf(tab);
    this.tabs.splice(index, 1);
    this.dynamicComponents.splice(index, 1);
  }

  closeAllTabs() {
    this.changeType = 'remove';
    this.tabs = [];
    this.dynamicComponents = [];
  }

  signout() {
    this.authService.logout();
    this.notifyService.warning('Signout Success');
  }

  loadProfileData() {
    // this.appServices.findUsers({ 'filter': JSON.stringify({ 'where': { 'username': this.appServices.account.username, 'status': 1, 'deleted': false } }) }, this)
    //   .then((__) => {
    //     let json = __.response.json();
    //     if (json.total > 0) {
    //       let res_User = json.res[0];
    //       this.appServices.afterSigninUser({ 'obj': JSON.stringify({ 'token': this.appServices.account.token, 'username': res_User.username, 'appcode': 'wms', 'type': res_User.type }) }, this)
    //         .then((object) => {
    //           let response = object.response.json().res;

    //           if (response.warehouse.findIndex((z) => {
    //             if (this.appServices.account.whseid === z.warehousecode) return z;
    //           }) >= 0) {
    //             this.authService.updateService({
    //               'whseid': this.appServices.account.whseid,
    //               'warehousename': this.appServices.account.warehousename,
    //               'username': res_User.username,
    //               'token': this.appServices.account.token,
    //               'listwarehouse': response.warehouse,
    //               'listowner': response.owner,
    //               'listmenu': response.menu,
    //               'currentuser': { 'parentuser': res_User.parentuser, 'type': res_User.type }
    //             });
    //           } else {
    //             this.authService.updateService({
    //               'whseid': response.warehouse[0].warehousecode,
    //               'warehousename': response.warehouse[0].warehousename,
    //               'username': res_User.username,
    //               'token': this.appServices.account.token,
    //               'listwarehouse': response.warehouse,
    //               'listowner': response.owner,
    //               'listmenu': response.menu,
    //               'currentuser': { 'parentuser': res_User.parentuser, 'type': res_User.type }
    //             });
    //           }
    //           this.data_currentuser = res_User;
    //         }).catch((err) => {
    //           this.utilityService.handleError(err);
    //         })
    //     } else {
    //       this.notifyService.error('USER_NOT_FOUND');
    //       this.authService.logout();
    //     }
    //   }).catch((err) => {
    //     this.utilityService.handleError(err);
    //   })
  }

  updateMyProfile(data) {
    // data['deleted'] = false;
    // data['editwho'] = this.appServices.account.username;
    // data['type'] = this.appServices.account.type;
    // data['token'] = this.appServices.account.token;
    // data['parentuser'] = this.appServices.account.parentuser;
    // data['status'] = 1;
    // this.appServices.updateUsers({ 'obj': JSON.stringify(data) }, this).then((__) => {
    //   if (data['currentpassword']) {
    //     if (data['password'] === data['comfirmpassword']) {
    //       this.appServices.findUsers({ 'filter': JSON.stringify({ 'where': { 'username': this.appServices.account.username, 'password': md5(data['currentpassword']), 'status': 1, 'deleted': false } }) }, this).then((_) => {
    //         let r = _.response.json().res;
    //         if (r.length > 0) {
    //           this.appServices.changePasswordUsers({ 'obj': JSON.stringify(data) }, this).then((obj) => {
    //             this.isChangePassword = false;
    //             this.notifyService.show('Process Done');
    //           }).catch(err => {
    //             this.utilityService.handleError(err);
    //           });
    //         } else {
    //           this.notifyService.show('Current Password not correct!', 'danger');
    //         }
    //       }).catch(err => {
    //         this.utilityService.handleError(err);
    //       })
    //     } else {
    //       this.notifyService.show('Comfirm password not correct!', 'danger');
    //     }
    //   } else {
    //     this.notifyService.show('Process Done');
    //   }
    // }).catch((err) => {
    //   this.utilityService.handleError(err);
    // })
  }

  changeWarehouse(data) {
    this.authService.changeWarehouse(data).then(() => {
      this.closeAllTabs();
    }).catch(err => {
      this.utilityService.handleError(err);
    });
  }
}
