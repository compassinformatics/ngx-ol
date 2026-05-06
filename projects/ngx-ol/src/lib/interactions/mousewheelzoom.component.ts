import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, signal, input } from '@angular/core';
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom';
import { Options } from 'ol/interaction/MouseWheelZoom';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-mousewheelzoom',
  template: '',
})
export class MouseWheelZoomInteractionComponent implements OnInit, OnChanges, OnDestroy {
  duration = input<number>();
  timeout = input<number>();
  useAnchor = input<boolean>();
  instance: MouseWheelZoom;
  protected readonly _instanceSignal = signal<MouseWheelZoom | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: MouseWheelZoom): MouseWheelZoom {
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
    this.setInstance(new MouseWheelZoom(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  private reloadInstance() {
    this.map.instance.removeInteraction(this.instance);
    this.initializeInstance();
  }

  private createOptions(): Options {
    return {
      duration: this.duration(),
      timeout: this.timeout(),
      useAnchor: this.useAnchor(),
    };
  }
}
