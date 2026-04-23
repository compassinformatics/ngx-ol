import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import MapEvent from 'ol/MapEvent';
import { ZoomSlider } from 'ol/control';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-control-zoomslider',
  template: ` <ng-content></ng-content> `,
})
export class ControlZoomSliderComponent implements OnInit, OnDestroy {
  @Input()
  className: string;
  @Input()
  duration: number;
  @Input()
  render?: (event: MapEvent) => void;
  @Input()
  target: string | HTMLElement;

  instance: ZoomSlider;

  constructor(private map: MapComponent) {
    // console.log('instancing aol-control-zoomslider');
  }

  ngOnInit() {
    this.instance = new ZoomSlider(this);
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
    // console.log('removing aol-control-zoomslider');
    this.map.instance.removeControl(this.instance);
  }
}
