// import { Injectable } from '@angular/core';
// import { Http, Headers } from '@angular/http';
// import { AppServices } from './../app.services';
// import { Router } from '@angular/router';
// import { NotifyService } from './../notify.service';
// import * as $ from 'jquery';
// import 'bootstrap';
// import { SocketService } from '../services/socket.service';
// @Injectable()
// export class AuthService {
//   constructor(private http: Http, 
//     private router: Router, 
//     private appServices: AppServices, 
//     private notifyService: NotifyService,
//     private socketService: SocketService) {
//   }
//   login(account) {
//     this.closeModal();
//     localStorage.setItem(document.location.origin, JSON.stringify({'id': account.token, 'u': account.username, 'w': account.whseid, 'ow': account.strowner, 'arr_ow': account.arrowner}));
//     this.appServices.account = account;
//     account.listmenu.forEach((value, index, arr)=>{
//       if(value.readonly > 0 || value.edit > 0){
//         this.appServices.account[value.menuurl] = {'readonly': value.readonly, 'edit': value.edit};
//       }
//     });
//     this.socketService.send({
//       code: "USER_LOGIN",
//       data: {
//         username: account.username,
//         token: account.token
//       }
//     });
//     this.router.navigate(['main']);
//   }
//   logout() {
//     this.closeModal();
//     localStorage.removeItem(document.location.origin);
//     this.initService();
//     this.router.navigate(['login']);
//   }
//   initService(){
//     this.appServices.account = {
//       'whseid': '',
//       'warehousename': '',
//       'username': '',
//       'token': '',
//       'listwarehouse': [],
//       'listowner': [],
//       'strowner': '',
//       'arrowner': [],
//       'listmenu': [],
//       'currentuser': {
//         'parentuser': '',
//         'type': 0
//       }
//     };
//   }
//   updateService(account){
//     localStorage.setItem(document.location.origin, JSON.stringify({'id': account.token, 'u': account.username, 'w': account.whseid, 'ow': account.strowner, 'arr_ow': account.arrowner }));
//     this.appServices.account = account;
//     account.listmenu.forEach((value, index, arr)=>{
//       if(value.readonly > 0 || value.edit > 0){
//         this.appServices.account[value.menuurl] = {'readonly': value.readonly, 'edit': value.edit};
//       }
//     });
//   }
//   closeModal(){
//     $('.modal').modal('hide');
//     $('.modal-backdrop').hide();
//   }
//   public checkToken(): boolean {
//     return this.appServices.checkToken({'token': this.appServices.account.token}, this).then(function(success){
//     }).catch((err)=>{
//       this.catchErr(err);
//     });
//   }
//   catchErr(err){
//     let message = typeof err.err === 'undefined' ? 'Error' : err.err.json().error.message;
//     this.notifyService.show(message, 'danger');
//     if(message === 'TOKEN_EXPIRED' || message === 'INVALID_ACCESS' || message === 'TOKEN_REQUIRED'){
//       this.logout();
//     }
//   }
// }
