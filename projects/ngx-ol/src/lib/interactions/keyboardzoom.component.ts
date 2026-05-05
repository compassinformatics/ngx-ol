import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import KeyboardZoom from 'ol/interaction/KeyboardZoom';
import { Options } from 'ol/interaction/KeyboardZoom';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-keyboardzoom',
  template: '',
})
export class KeyboardZoomInteractionComponent implements OnInit, OnDestroy {
  @Input() duration?: number;
  @Input() delta?: number;

  instance: KeyboardZoom;

  protected readonly _instanceSignal = signal<
    KeyboardZoom | undefined
  >(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: KeyboardZoom): KeyboardZoom {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.setInstance(new KeyboardZoom(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      duration: this.duration,
      delta: this.delta,
    };
  }
}
