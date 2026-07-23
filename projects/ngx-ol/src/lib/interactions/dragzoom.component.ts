import { Component, OnDestroy, OnInit, input, signal, inject } from '@angular/core';
import DragZoom from 'ol/interaction/DragZoom.js';
import { Options } from 'ol/interaction/DragZoom.js';
import { MapComponent } from '../map.component';
import { Condition } from 'ol/events/condition.js';

@Component({
  selector: 'aol-interaction-dragzoom',
  template: '',
})
export class DragZoomInteractionComponent implements OnInit, OnDestroy {
  readonly className = input<string>();
  readonly condition = input<Condition>();
  readonly duration = input<number>();
  readonly out = input<boolean>();

  instance: DragZoom;

  protected readonly _instanceSignal = signal<DragZoom | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: DragZoom): DragZoom {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  private readonly map = inject(MapComponent);

  ngOnInit() {
    this.setInstance(new DragZoom(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      className: this.className(),
      condition: this.condition(),
      duration: this.duration(),
      out: this.out(),
    };
  }
}
