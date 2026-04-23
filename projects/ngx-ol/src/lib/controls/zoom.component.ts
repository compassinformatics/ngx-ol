import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Zoom } from 'ol/control';
import { Options } from 'ol/control/Zoom';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-control-zoom',
  template: ` <ng-content></ng-content> `,
})
export class ControlZoomComponent implements OnInit, OnDestroy {
  @Input()
  duration: number;
  @Input()
  className: string;
  @Input()
  zoomInClassName: string;
  @Input()
  zoomOutClassName: string;
  @Input()
  zoomInLabel: string | HTMLElement;
  @Input()
  zoomOutLabel: string | HTMLElement;
  @Input()
  zoomInTipLabel: string;
  @Input()
  zoomOutTipLabel: string;
  @Input()
  delta: number;
  @Input()
  target: string | HTMLElement;

  instance: Zoom;

  constructor(private map: MapComponent) {
    // console.log('instancing aol-control-zoom');
  }

  ngOnInit() {
    this.instance = new Zoom(this.createOptions());
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
    // console.log('removing aol-control-zoom');
    this.map.instance.removeControl(this.instance);
  }

  private createOptions(): Options {
    return {
      duration: this.duration,
      className: this.className,
      zoomInClassName: this.zoomInClassName,
      zoomOutClassName: this.zoomOutClassName,
      zoomInLabel: this.zoomInLabel,
      zoomOutLabel: this.zoomOutLabel,
      zoomInTipLabel: this.zoomInTipLabel,
      zoomOutTipLabel: this.zoomOutTipLabel,
      delta: this.delta,
      target: this.target,
    };
  }
}
