import { Component, OnDestroy, OnInit, input, signal, inject } from '@angular/core';
import PinchRotate from 'ol/interaction/PinchRotate.js';
import type { Options } from 'ol/interaction/PinchRotate.js';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-pinchrotate',
  template: '',
})
export class PinchRotateInteractionComponent implements OnInit, OnDestroy {
  readonly duration = input<number>();

  readonly threshold = input<number>();

  instance: PinchRotate;

  protected readonly _instanceSignal = signal<PinchRotate | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: PinchRotate): PinchRotate {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  private readonly map = inject(MapComponent);

  ngOnInit() {
    this.setInstance(new PinchRotate(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      duration: this.duration(),
      threshold: this.threshold(),
    };
  }
}
