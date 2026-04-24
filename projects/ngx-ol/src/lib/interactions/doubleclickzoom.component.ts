import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DoubleClickZoom } from 'ol/interaction';
import { Options } from 'ol/interaction/DoubleClickZoom';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-doubleclickzoom',
  template: '',
})
export class DoubleClickZoomInteractionComponent implements OnInit, OnDestroy {
  @Input()
  duration?: number;
  @Input()
  delta?: number;

  instance: DoubleClickZoom;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new DoubleClickZoom(this.createOptions());
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      duration: this.duration,
      delta: this.delta,
    };
  }
}
