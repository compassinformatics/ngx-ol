import { Component, OnDestroy, OnInit, signal, input } from '@angular/core';
import MapEvent from 'ol/MapEvent';
import Rotate from 'ol/control/Rotate';
import { Options } from 'ol/control/Rotate';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-control-rotate',
  template: ` <ng-content></ng-content> `,
})
export class ControlRotateComponent implements OnInit, OnDestroy {
  className = input<string>();
  label = input<string | HTMLElement>();
  tipLabel = input<string>();
  compassClassName = input<string>();
  duration = input<number>();
  autoHide = input<boolean>();
  render = input<(event: MapEvent) => void>();
  resetNorth = input<() => void>();
  target = input<string | HTMLElement>();

  instance: Rotate;

  protected readonly _instanceSignal = signal<Rotate | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Rotate): Rotate {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(private map: MapComponent) {
    // console.log('instancing aol-control-rotate');
  }

  ngOnInit() {
    this.setInstance(new Rotate(this.createOptions()));
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
    // console.log('removing aol-control-rotate');
    this.map.instance.removeControl(this.instance);
  }

  private createOptions(): Options {
    return {
      className: this.className(),
      label: this.label(),
      tipLabel: this.tipLabel(),
      compassClassName: this.compassClassName(),
      duration: this.duration(),
      autoHide: this.autoHide(),
      render: this.render(),
      resetNorth: this.resetNorth(),
      target: this.target(),
    };
  }
}
