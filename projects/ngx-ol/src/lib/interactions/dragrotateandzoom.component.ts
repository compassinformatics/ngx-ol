import { Component, OnDestroy, OnInit, input, signal, inject } from '@angular/core';
import DragRotateAndZoom from 'ol/interaction/DragRotateAndZoom.js';
import { Options } from 'ol/interaction/DragRotateAndZoom.js';
import { MapComponent } from '../map.component';
import { Condition } from 'ol/events/condition.js';

@Component({
  selector: 'aol-interaction-dragrotateandzoom',
  template: '',
})
export class DragRotateAndZoomInteractionComponent implements OnInit, OnDestroy {
  readonly condition = input<Condition>();
  readonly duration = input<number>();

  instance: DragRotateAndZoom;

  protected readonly _instanceSignal = signal<DragRotateAndZoom | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: DragRotateAndZoom): DragRotateAndZoom {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  private readonly map = inject(MapComponent);

  ngOnInit() {
    this.setInstance(new DragRotateAndZoom(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      condition: this.condition(),
      duration: this.duration(),
    };
  }
}
