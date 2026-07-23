import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  input,
  signal,
  inject,
} from '@angular/core';
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom.js';
import { Options } from 'ol/interaction/MouseWheelZoom.js';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-mousewheelzoom',
  template: '',
})
export class MouseWheelZoomInteractionComponent implements OnInit, OnChanges, OnDestroy {
  readonly duration = input<number>();
  readonly timeout = input<number>();
  readonly useAnchor = input<boolean>();

  instance: MouseWheelZoom;

  protected readonly _instanceSignal = signal<MouseWheelZoom | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: MouseWheelZoom): MouseWheelZoom {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  private readonly map = inject(MapComponent);

  ngOnInit() {
    this.setInstance(new MouseWheelZoom(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.instance && changes.useAnchor?.currentValue !== undefined) {
      this.instance.setMouseAnchor(changes.useAnchor.currentValue);
    }
  }

  private createOptions(): Options {
    return {
      duration: this.duration(),
      timeout: this.timeout(),
      useAnchor: this.useAnchor(),
    };
  }
}
