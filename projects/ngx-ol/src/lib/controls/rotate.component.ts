import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  input,
  signal,
} from '@angular/core';
import MapEvent from 'ol/MapEvent';
import Rotate from 'ol/control/Rotate';
import { Options } from 'ol/control/Rotate';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-control-rotate',
  template: ` <ng-content></ng-content> `,
})
export class ControlRotateComponent implements OnInit, OnChanges, OnDestroy {
  readonly className = input<string>();
  readonly label = input<string | HTMLElement>();
  readonly tipLabel = input<string>();
  readonly compassClassName = input<string>();
  readonly duration = input<number>();
  readonly autoHide = input<boolean>();
  readonly render = input<(event: MapEvent) => void>();
  readonly resetNorth = input<() => void>();
  readonly target = input<string | HTMLElement>();

  instance: Rotate;

  protected readonly _instanceSignal = signal<Rotate | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Rotate): Rotate {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  constructor(private readonly map: MapComponent) {
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

  ngOnChanges(changes: SimpleChanges) {
    if (this.instance && changes.target?.currentValue !== undefined) {
      this.instance.setTarget(changes.target.currentValue);
    }
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
