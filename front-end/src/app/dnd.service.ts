import { Injectable } from '@angular/core';

declare var $:any;
declare var document:any;

@Injectable()
export class DnDService {
  cloneEls = [];
  constructor() { }

  doDrag(dragEl, dropEl, options, callback) {
    if(Object.keys(options).length == 0) {
      options = {
        'mode': 'move', // clone
      }
    }
    let dragEls = document.getElementsByClassName(dragEl);
    let dropEls = document.getElementsByClassName(dropEl);
    [].forEach.call(dragEls, function(dragEl, position) {
      dragEl.addEventListener('dragstart', function (e) {
        var style = window.getComputedStyle(e.target, null);
        e.dataTransfer.setData('text/plain', position + ',' + (parseInt(style.getPropertyValue('left'), 10) - e.clientX) + ',' + (parseInt(style.getPropertyValue('top'), 10) - e.clientY));
      }, false);
    });
    [].forEach.call(dropEls, (dropEl) => {
      dropEl.addEventListener('dragover', function (e) {
        e.preventDefault();
      }, false);
      dropEl.addEventListener('dragenter', function(e) {
        dropEl.style.background = 'purple';
      }, false);
      dropEl.addEventListener('dragleave', function(e) {
        dropEl.style.background = '';
      }, false);
      dropEl.addEventListener('drop', (e) => {
        dropEl.style.background = '';
        var offset = e.dataTransfer.getData('text/plain').split(',');
        let dragEl = dragEls[offset[0]];
        if(options.mode == 'move') {
          dragEl.style.left = (e.clientX + parseInt(offset[1], 10)) + 'px';
          dragEl.style.top = (e.clientY + parseInt(offset[2], 10)) + 'px';
          dragEl.addEventListener('click', function (e) {
            e.target.style.left = '0px';
            e.target.style.top = '0px';
          });
          callback({
            dropEl, dragEl
          });
        } else if(options.mode == 'clone') {
          if(dragEl) {
            var cloneEl = dragEl.cloneNode(true);
            cloneEl.style.position = 'absolute';
            cloneEl.style.left = (e.pageX) + 'px';
            cloneEl.style.top = (e.pageY) + 'px';
            cloneEl.addEventListener('click', function (e) {
              e.target.remove();
            });
            this.cloneEls.push(cloneEl);
            document.body.appendChild(cloneEl);
            callback({
              dropEl, cloneEl
            });
          }
        }
        event.preventDefault();
      }, false);
    });
  }

  doClean() {
    this.cloneEls.forEach(function(clone){
      clone.remove();
    })
  }
}
