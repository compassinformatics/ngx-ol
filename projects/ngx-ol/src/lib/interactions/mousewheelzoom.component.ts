import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom';
import { Options } from 'ol/interaction/MouseWheelZoom';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-mousewheelzoom',
  template: '',
})
export class MouseWheelZoomInteractionComponent implements OnInit, OnDestroy {
  @Input() duration?: number;
  @Input() timeout?: number;
  @Input() useAnchor?: boolean;

  instance: MouseWheelZoom;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new MouseWheelZoom(this.createOptions());
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      duration: this.duration,
      timeout: this.timeout,
      useAnchor: this.useAnchor,
    };
  }
}
