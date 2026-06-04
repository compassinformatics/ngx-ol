import { Component, ElementRef, OnInit, inject } from '@angular/core';

@Component({
  selector: 'aol-attribution',
  template: '<ng-content></ng-content>',
})
export class AttributionComponent implements OnInit {
  label: string;

  private readonly elementRef = inject(ElementRef);

  ngOnInit() {
    this.label = this.elementRef.nativeElement.innerHTML;
  }
}
