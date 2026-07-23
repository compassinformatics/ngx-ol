import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  input,
  signal,
  inject,
} from '@angular/core';
import ScaleLine from 'ol/control/ScaleLine.js';
import { MapComponent } from '../map.component';
import { Options, Units } from 'ol/control/ScaleLine.js';
import MapEvent from 'ol/MapEvent.js';

@Component({
  selector: 'aol-control-scaleline',
  template: ` <ng-content></ng-content> `,
})
export class ControlScaleLineComponent implements OnInit, OnChanges, OnDestroy {
  readonly className = input<string>();
  readonly minWidth = input<number>();
  readonly maxWidth = input<number>();
  readonly render = input<(event: MapEvent) => void>();
  readonly target = input<string | HTMLElement>();
  readonly units = input<Units>();
  readonly bar = input<boolean>();
  readonly steps = input<number>();
  readonly text = input<boolean>();
  readonly dpi = input<number>();

  instance: ScaleLine;

  protected readonly _instanceSignal = signal<ScaleLine | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: ScaleLine): ScaleLine {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  private readonly map = inject(MapComponent);

  ngOnInit() {
    this.setInstance(new ScaleLine(this.createOptions()));
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeControl(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.instance) {
      return;
    }
    if (changes.units?.currentValue !== undefined) {
      this.instance.setUnits(changes.units.currentValue);
    }
    if (changes.dpi) {
      this.instance.setDpi(changes.dpi.currentValue);
    }
  }

  private createOptions(): Options {
    return {
      className: this.className(),
      minWidth: this.minWidth(),
      maxWidth: this.maxWidth(),
      render: this.render(),
      target: this.target(),
      units: this.units(),
      bar: this.bar(),
      steps: this.steps(),
      text: this.text(),
      dpi: this.dpi(),
    };
  }
}
