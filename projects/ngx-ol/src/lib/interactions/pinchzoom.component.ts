import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { PinchZoom } from 'ol/interaction';
import { Options } from 'ol/interaction/PinchZoom';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-pinchzoom',
  template: '',
})
export class PinchZoomInteractionComponent implements OnInit, OnDestroy {
  @Input()
  duration: number;

  instance: PinchZoom;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new PinchZoom(this.createOptions());
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      duration: this.duration,
    };
  }
}
