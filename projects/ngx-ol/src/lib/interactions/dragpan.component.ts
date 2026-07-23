import { Component, OnDestroy, OnInit, input, signal, inject } from '@angular/core';
import DragPan from 'ol/interaction/DragPan.js';
import { Options } from 'ol/interaction/DragPan.js';
import Kinetic from 'ol/Kinetic.js';
import { MapComponent } from '../map.component';
import { Condition } from 'ol/events/condition.js';

@Component({
  selector: 'aol-interaction-dragpan',
  template: '',
})
export class DragPanInteractionComponent implements OnInit, OnDestroy {
  readonly condition = input<Condition>();
  readonly kinetic = input<Kinetic>();

  instance: DragPan;

  protected readonly _instanceSignal = signal<DragPan | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: DragPan): DragPan {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  private readonly map = inject(MapComponent);

  ngOnInit() {
    this.setInstance(new DragPan(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      condition: this.condition(),
      kinetic: this.kinetic(),
    };
  }
}
