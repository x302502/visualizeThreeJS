import { Injectable } from '@angular/core';

declare var $:any;

@Injectable()
export class PasteService {

  constructor() { }

  doImport(data, callback) {
    try {
      let allTextLines = data.split(/\r\n|\n/);
      let isTitle = allTextLines[1] == '' ? false : true;
      let headers = allTextLines[0].split('\t');
      let skipToData = 1;
      if(!isTitle) {
        let title = allTextLines[0].split(',');
        headers = allTextLines[2].split(',');
        skipToData = 3;
      }
      let lines = [];
      for (let i = skipToData; i < allTextLines.length; i++) {
        let data = allTextLines[i].split('\t');
        if (data.length == headers.length) {
          let tarr = {};
          for (let j = 0; j < headers.length; j++) {
            if(data[j] == 'FALSE' || data[j] == 'TRUE') {
              tarr = Object.assign(tarr, {[headers[j]]: eval(data[j].toLowerCase())})
            } else if(!isNaN(data[j])) {
              tarr = Object.assign(tarr, {[headers[j]]: eval(data[j])})
            } else {
              tarr = Object.assign(tarr, {[headers[j]]: data[j]})
            }
          }
          lines.push(tarr);
        }
      }
      if(lines.length > 0) {
        if(confirm('Do you want to import?')) {
          callback(lines);
        }
      }
    } catch(err) {
      console.log('Invalid Import');
    }
  }

}
