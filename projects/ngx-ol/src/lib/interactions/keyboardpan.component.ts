import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, signal, input } from '@angular/core';
import KeyboardPan from 'ol/interaction/KeyboardPan';
import { Options } from 'ol/interaction/KeyboardPan';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-keyboardpan',
  template: '',
})
export class KeyboardPanInteractionComponent implements OnInit, OnChanges, OnDestroy {
  readonly duration = input<number>();
  readonly pixelDelta = input<number>();
  instance: KeyboardPan;
  protected readonly _instanceSignal = signal<KeyboardPan | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: KeyboardPan): KeyboardPan {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(private readonly map: MapComponent) {}

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
    this.setInstance(new KeyboardPan(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  private reloadInstance() {
    this.map.instance.removeInteraction(this.instance);
    this.initializeInstance();
  }

  private createOptions(): Options {
    return {
      duration: this.duration(),
      pixelDelta: this.pixelDelta(),
    };
  }
}
