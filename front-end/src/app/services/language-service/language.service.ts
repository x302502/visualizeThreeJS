import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import * as resource from './language.resources';

@Injectable()
export class LanguageService {
  languages = ['EN', 'VI'];
  language = 'EN';
  dictionary: Map<string, any>;
  constructor(private http: Http) {
    this.dictionary = new Map<string, any>();
  }

  change() {
    if (this.language === 'EN') this.language = 'VI';
    else this.language = 'EN';
    this.dictionary.forEach((value, key) => {
      switch (this.language) {
        case 'VI': {
          Object.assign(value, resource.VI[key]);
          break;
        }
        default: Object.assign(value, resource.EN[key]);
      }
    });
  }

  load(component: string) {
    let language = this.language;
    if (this.dictionary.has(component)) {
      return this.dictionary.get(component);
    } else {
      this.dictionary.set(component, {});
      switch (language) {
        case 'VI': {
          Object.assign(this.dictionary.get(component), resource.VI[component]);
          break;
        }
        default: Object.assign(this.dictionary.get(component), resource.EN[component]);
      }
      return this.dictionary.get(component);
    }
  }
}