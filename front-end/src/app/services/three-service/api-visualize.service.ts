import { Injectable } from '@angular/core';
import { ApiService } from '../api-service/api.service';
import { API } from '../api-service/api.resource';
import { AuthService } from '../auth-service/auth.service';

@Injectable()
export class ApiVisualizeService {

  constructor(private  apiService: ApiService,private authService: AuthService) { }
  
 loadLocList(){
   let data = {
     whseid: this.authService.user.whseid ,
     deleted: false,
     skip: undefined 
    }
   return  this.apiService.post(API.LIST_LOCATION,data)
   .then(res => res.json().res)
   .catch(err => err);
  }
}
