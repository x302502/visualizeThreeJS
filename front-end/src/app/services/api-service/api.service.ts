import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { ConfigService } from '../config-service/config.service';
import { NotifyService } from '../../notify.service';
import { AuthService } from '../auth-service/auth.service';

@Injectable()
export class ApiService {
  host: string;
  hostAuth: string;
  constructor(private http: Http,
    private router: Router,
    private configService: ConfigService,
    private notifyService: NotifyService,
    private authService: AuthService) {
    this.host = this.configService.clientConfig.host;
    this.hostAuth = this.configService.clientConfig.hostAuth;
  }
  post(url: string, data: any) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('token', this.authService.user.token);
    return new Promise<Response>((resolve, reject) => {
      this.http.post(this.host + url, data, { headers })
        .toPromise()
        .then(res => {
          resolve(res);
        }).catch(err => {
          // Log url và data gây ra lỗi
          console.error({ url, data });
          // Kiểm tra có phải lỗi do server trả về hay không
          if (err.json) {
            // Kiểm tra lỗi server trả về có message hay không
            if (err.json().error && err.json().error.message) {
              let message = err.json().error.message;
              // Nếu message là TOKEN_EXPIRED, INVALID_ACCESS hay TOKEN_REQUIRED thì trở về trang Login
              if (message === 'TOKEN_EXPIRED' || message === 'INVALID_ACCESS' || message === 'TOKEN_REQUIRED') {
                this.router.navigate(['login']);
              }
              // Thông báo lỗi
              this.notifyService.error(message);
            } else {
              // Log error
              console.error(err.json());
            }
          } else {
            // Thông báo lỗi
            this.notifyService.error(`[ERROR_API] ${url}`);
          }
          reject(err);
        });
    });
  }
}
