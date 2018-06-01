import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../notify.service';
import { UtilityService } from '../../services/utility-service/utility.service';
import { AuthService } from '../../services/auth-service/auth.service';
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private appServices: AppServices,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notifyService: NotifyService,
    private utilityService: UtilityService) {
  }
  ngOnInit() {
  }
  signin(data) {
    this.authService.login(data.username, data.password).then(()=>{
      this.router.navigate(['main']);
    }).catch(err=>{
      this.utilityService.handleError(err);
    })

    // this.appServices.signinWMSUsers({'obj': JSON.stringify({"username": data.username, "password": data.password})}, this).then(__=>{
    //   let res = __.response.json().res;
    //   __.component.appServices.afterSigninUser({'obj': JSON.stringify({'token': res.token.id, 'username': res.token.uid, 'appcode': 'wms', 'type': res.user.type })})
    //   .then(object=>{
    //     let response = object.response.json().res;
    //     __.component.appServices._getlistCodelkup({'obj': JSON.stringify({'whseid': response.warehouse[0].warehousecode, 'listname': 'Paginate', 'deleted': false})}, this)
    //     .then(page=>{
    //       let paginate = page.response.json().res;
    //       this.authService.login({
    //         'whseid': response.warehouse[0].warehousecode,
    //         'warehousename': response.warehouse[0].warehousename,
    //         'username': res.token.uid,
    //         'token': res.token.id,
    //         'listwarehouse': response.warehouse,
    //         'listowner': response.owner,
    //         'strowner': response.strowner,
    //         'arrowner': response.arrowner,
    //         'listmenu': response.menu,
    //         'currentuser': {'parentuser': res.user.parentuser, 'type': res.user.type},
    //         'paginate': paginate
    //       });
    //     }).catch((err)=>{
    //       this.utilityService.handleError(err);
    //     })
    //   }).catch((err) => {
    //     this.utilityService.handleError(err);
    //   })
    // }).catch((err)=>{
    //   this.utilityService.handleError(err);
    // })
  }
  forgotPasswordUsersData(data) {
    this.appServices.forgotPasswordWMSUsers({ 'obj': JSON.stringify({ 'appcode': 'wms', 'username': data.username, 'email': data.email, 'editwho': 'system' }) }, this)
      .then(function (__) {
        __.component.notifyService.show('Process Done! <br/> Check your mail, you will receive an email including a new password from Smartlog System');
        $('#modalForgotPasswordUsers').modal('hide');
      }).catch((err) => {
        this.utilityService.handleError(err);
      })
  }
}
