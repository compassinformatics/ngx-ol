import { Component, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'aol-content',
  template: '<ng-content></ng-content>',
})
export class ContentComponent {
  readonly elementRef = inject(ElementRef);
}
