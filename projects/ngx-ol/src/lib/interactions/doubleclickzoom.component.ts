import { Component, OnDestroy, OnInit, input, signal, inject } from '@angular/core';
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import { Options } from 'ol/interaction/DoubleClickZoom';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-doubleclickzoom',
  template: '',
})
export class DoubleClickZoomInteractionComponent implements OnInit, OnDestroy {
  duration = input<number>();
  delta = input<number>();

  instance: DoubleClickZoom;

  protected readonly _instanceSignal = signal<DoubleClickZoom | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: DoubleClickZoom): DoubleClickZoom {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  private readonly map = inject(MapComponent);

  ngOnInit() {
    this.setInstance(new DoubleClickZoom(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      duration: this.duration(),
      delta: this.delta(),
    };
  }
}
