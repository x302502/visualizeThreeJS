import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { UtilityService } from '../utility-service/utility.service';
declare var document: any;
@Injectable()
export class AuthManager implements CanActivate {
  constructor(private router: Router,
    private authService: AuthService,
    private utilityService: UtilityService) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.authService.checkToken().then(() => {
        resolve(true);
      }).catch(err => {
        this.utilityService.handleError(err);
        this.router.navigate(['login']);
        resolve(false);
      });
    });
  }
}
