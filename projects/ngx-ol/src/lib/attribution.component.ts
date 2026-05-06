import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'aol-attribution',
  template: '<ng-content></ng-content>',
})
export class AttributionComponent implements OnInit {
  label: string;

  constructor(private readonly elementRef: ElementRef) {}

  ngOnInit() {
    this.label = this.elementRef.nativeElement.innerHTML;
  }
}
