import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import KeyboardPan from 'ol/interaction/KeyboardPan';
import { Options } from 'ol/interaction/KeyboardPan';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-keyboardpan',
  template: '',
})
export class KeyboardPanInteractionComponent implements OnInit, OnDestroy {
  @Input() duration?: number;
  @Input() pixelDelta?: number;

  instance: KeyboardPan;

  protected readonly _instanceSignal = signal<KeyboardPan | undefined>(
    undefined,
  );

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: KeyboardPan): KeyboardPan {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.setInstance(new KeyboardPan(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      duration: this.duration,
      pixelDelta: this.pixelDelta,
    };
  }
}
