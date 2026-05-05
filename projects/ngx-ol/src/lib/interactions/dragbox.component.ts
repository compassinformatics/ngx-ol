import { Component, OnDestroy, OnInit, Input, signal } from '@angular/core';
import DragBox from 'ol/interaction/DragBox';
import { Options } from 'ol/interaction/DragBox';
import { MapComponent } from '../map.component';
import { Condition } from 'ol/events/condition';
import { EndCondition } from 'ol/interaction/DragBox';

@Component({
  selector: 'aol-interaction-dragbox',
  template: '',
})
export class DragBoxInteractionComponent implements OnInit, OnDestroy {
  @Input() className?: string;
  @Input() condition?: Condition;
  @Input() boxEndCondition?: EndCondition;

  instance: DragBox;

  protected readonly _instanceSignal = signal<DragBox | undefined>(
    undefined,
  );

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: DragBox): DragBox {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.setInstance(new DragBox(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      className: this.className,
      condition: this.condition,
      boxEndCondition: this.boxEndCondition,
    };
  }
}
