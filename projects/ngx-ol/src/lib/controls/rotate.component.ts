import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import MapEvent from 'ol/MapEvent';
import Rotate from 'ol/control/Rotate';
import { Options } from 'ol/control/Rotate';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-control-rotate',
  template: ` <ng-content></ng-content> `,
})
export class ControlRotateComponent implements OnInit, OnDestroy {
  @Input() className?: string;
  @Input() label?: string | HTMLElement;
  @Input() tipLabel?: string;
  @Input() compassClassName?: string;
  @Input() duration?: number;
  @Input() autoHide?: boolean;
  @Input() render?: (event: MapEvent) => void;
  @Input() resetNorth?: () => void;
  @Input() target?: string | HTMLElement;

  instance: Rotate;

  constructor(private map: MapComponent) {
    // console.log('instancing aol-control-rotate');
  }

  ngOnInit() {
    this.instance = new Rotate(this.createOptions());
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
    // console.log('removing aol-control-rotate');
    this.map.instance.removeControl(this.instance);
  }

  private createOptions(): Options {
    return {
      className: this.className,
      label: this.label,
      tipLabel: this.tipLabel,
      compassClassName: this.compassClassName,
      duration: this.duration,
      autoHide: this.autoHide,
      render: this.render,
      resetNorth: this.resetNorth,
      target: this.target,
    };
  }
}
