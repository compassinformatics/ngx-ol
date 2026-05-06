import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, signal, input } from '@angular/core';
import PinchRotate from 'ol/interaction/PinchRotate';
import type { Options } from 'ol/interaction/PinchRotate';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-pinchrotate',
  template: '',
})
export class PinchRotateInteractionComponent implements OnInit, OnChanges, OnDestroy {
  duration = input<number>();

  threshold = input<number>();

  instance: PinchRotate;

  protected readonly _instanceSignal = signal<PinchRotate | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: PinchRotate): PinchRotate {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.initializeInstance();
  }

  ngOnChanges(changes: SimpleChanges) {
    const requiresReload = Object.keys(changes).some((key) => !changes[key].firstChange);

    if (requiresReload && this.instance) {
      this.reloadInstance();
    }
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private initializeInstance() {
    this.setInstance(new PinchRotate(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  private reloadInstance() {
    this.map.instance.removeInteraction(this.instance);
    this.initializeInstance();
  }

  private createOptions(): Options {
    return {
      duration: this.duration(),
      threshold: this.threshold(),
    };
  }
}
