import { Component, OnDestroy, OnInit, signal, input } from '@angular/core';
import PinchZoom from 'ol/interaction/PinchZoom';
import { Options } from 'ol/interaction/PinchZoom';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-pinchzoom',
  template: '',
})
export class PinchZoomInteractionComponent implements OnInit, OnDestroy {
  duration = input<number>();

  instance: PinchZoom;

  protected readonly _instanceSignal = signal<PinchZoom | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: PinchZoom): PinchZoom {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.setInstance(new PinchZoom(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      duration: this.duration(),
    };
  }
}
