import { Injectable } from '@angular/core';
import { Http,Headers, RequestOptions,URLSearchParams } from '@angular/http';
const HOST = `http://118.69.65.208:2001/rtls/`;
@Injectable()
export class DataThreeService {

  constructor(private http: Http) {
    
  }
  getData(path: string, params: Object) {    
    let tempParams = new URLSearchParams();
    for (let key in params) {
      tempParams.set(encodeURI(key),encodeURI(params[key]))
    }
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    'Access-Control-Allow-Origin': '*','Access-Control-Allow-Credentials': true});
    return this.http.get(HOST + path,new RequestOptions({params : tempParams,headers: headers })).toPromise()
    //return this.http.get(HOST + path + '?' + tempParams.toString()).toPromise();
  }
  
  getToken(username: string, password: string) {
    let path = 'gettoken';
    let params = {
      username: username,
      password: password
    }
    return this.getData(path, params);
  }
  setPosBaseStation(baseid: number, token: string, x: number, y: number, z: number) {
    let path = 'setpos';
    let basepos = `${x},${y},${z}`;
    let params = {
      baseid: baseid,
      basepos: basepos,
      token: token
    }
    return this.getData(path, params);
  }
  getPosBaseStation(baseid: number, token: string) {
    let path = 'getpos';
    let params = {
      baseid: baseid,
      token: token
    }
    return this.getData(path, params);
  }
  getNewPosTag(tagid: number, token: string) {
    let path = 'getpos';
    let params = {
      tagid: tagid,
      token: token
    }
    return this.getData(path, params);
  }
  getNewDistance(tagid: number, baseid: number, token: string){
    let path = 'getdistance';
    let params = {
      tagid: tagid,
      baseid: baseid,
      token: token
    }
    return this.getData(path, params);
  }
  listTagOnTimes(tagid: number, token: string, from: number, to: number) {
    let path = 'getpos';
    let params = {
      tagid: tagid,
      from: from,
      to: to,
      token: token
    }
    return this.getData(path, params);
  }
  getTagByGroupOnTimes(tagid: number, groupid: string, token: string, from: number, to: number) {
    let path = 'gettagbygroup';
    let params = {
      tagid: tagid,
      groupid: groupid,
      from: from,
      to: to,
      token: token
    }
    return this.getData(path, params);
  }
  getDistanceOnTimes(tagid: number, baseid: number, token: string, from: number, to: number) {
    let path = 'getdistance';
    let params = {
      tagid: tagid,
      baseid: baseid,
      from: from,
      to: to,
      token: token
    }
    return this.getData(path, params);
  }
  createGroup(groupid: string,token: string,tags:[number]) {
    let path = 'setgroup';
    let stringTags = ''+tags[0];
    for(let i=1 ;i <  tags.length ; i++){
      stringTags += `,${tags[i]}`;
    }
    let params = {
      groupid: groupid,
      tags: stringTags,
      token: token
    }
    return this.getData(path, params);
  }
  listGroup(groupid: string,token: string){
    let path = 'listgroup';
    let params = {
      groupid: groupid,
      token: token
    }
    return this.getData(path, params);
  }
  deleteGroup(groupid: string,token: string){
    let path = 'deletegroup';
    let params = {
      groupid: groupid,
      token: token
    }
    return this.getData(path, params);
  }


}
