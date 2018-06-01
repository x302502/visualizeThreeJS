import { Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'jsontodic' })
export class JSONtoDictionaryPipe implements PipeTransform {
  transform(value): any {
    if(!value) return null;
    return Object.keys(value);
    // if(typeof value === 'object'){
    //   return Object.keys(value);
    // } else {
    //   return Object.keys(JSON.parse(value));
    // }
  }
}
