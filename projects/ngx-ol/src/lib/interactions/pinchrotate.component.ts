import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import PinchRotate from 'ol/interaction/PinchRotate';
import type { Options } from 'ol/interaction/PinchRotate';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-pinchrotate',
  template: '',
})
export class PinchRotateInteractionComponent implements OnInit, OnDestroy {
  @Input() duration?: number;

  @Input() threshold?: number;

  instance: PinchRotate;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new PinchRotate(this.createOptions());
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      duration: this.duration,
      threshold: this.threshold,
    };
  }
}
