import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, signal, input } from '@angular/core';
import PinchZoom from 'ol/interaction/PinchZoom';
import { Options } from 'ol/interaction/PinchZoom';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-pinchzoom',
  template: '',
})
export class PinchZoomInteractionComponent implements OnInit, OnChanges, OnDestroy {
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
    this.setInstance(new PinchZoom(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  private reloadInstance() {
    this.map.instance.removeInteraction(this.instance);
    this.initializeInstance();
  }

  private createOptions(): Options {
    return {
      duration: this.duration(),
    };
  }
}
