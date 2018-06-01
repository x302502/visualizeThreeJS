import { Injectable, EventEmitter } from '@angular/core';

import * as uuid from 'uuid';

import * as $ from 'jquery';

@Injectable()
export class LoadingService {

    loadingId = uuid.v4();
    progressId = uuid.v4();
    constructor() {
    }
    
    // Loading
    startLoading() {
        $('body').append(`<element id="${this.loadingId}" class="loader"></element>`);
    }

    stopLoading() {
        $(`#${this.loadingId}`).remove();
    }

    // Progress
    startProgress(min: number, max: number){

    }

    updateProgress(){

    }

    stopProgress(){

    }
}