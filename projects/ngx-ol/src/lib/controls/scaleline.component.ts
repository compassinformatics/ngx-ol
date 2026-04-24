import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ScaleLine } from 'ol/control';
import { MapComponent } from '../map.component';
import { Options, Units } from 'ol/control/ScaleLine';
import MapEvent from 'ol/MapEvent';

@Component({
  selector: 'aol-control-scaleline',
  template: ` <ng-content></ng-content> `,
})
export class ControlScaleLineComponent implements OnInit, OnDestroy {
  @Input()
  className?: string;
  @Input()
  minWidth?: number;
  @Input()
  maxWidth?: number;
  @Input()
  render?: (event: MapEvent) => void;
  @Input()
  target?: string | HTMLElement;
  @Input()
  units?: Units;
  @Input()
  bar?: boolean;
  @Input()
  steps?: number;
  @Input()
  text?: boolean;
  @Input()
  dpi?: number;

  instance: ScaleLine;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new ScaleLine(this.createOptions());
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeControl(this.instance);
  }

  private createOptions(): Options {
    return {
      className: this.className,
      minWidth: this.minWidth,
      maxWidth: this.maxWidth,
      render: this.render,
      target: this.target,
      units: this.units,
      bar: this.bar,
      steps: this.steps,
      text: this.text,
      dpi: this.dpi,
    };
  }
}
