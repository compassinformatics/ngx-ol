import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, signal, input } from '@angular/core';
import KeyboardZoom from 'ol/interaction/KeyboardZoom';
import { Options } from 'ol/interaction/KeyboardZoom';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-keyboardzoom',
  template: '',
})
export class KeyboardZoomInteractionComponent implements OnInit, OnChanges, OnDestroy {
  duration = input<number>();
  delta = input<number>();
  instance: KeyboardZoom;
  protected readonly _instanceSignal = signal<KeyboardZoom | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: KeyboardZoom): KeyboardZoom {
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
    this.setInstance(new KeyboardZoom(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  private reloadInstance() {
    this.map.instance.removeInteraction(this.instance);
    this.initializeInstance();
  }

  private createOptions(): Options {
    return {
      duration: this.duration(),
      delta: this.delta(),
    };
  }
}
