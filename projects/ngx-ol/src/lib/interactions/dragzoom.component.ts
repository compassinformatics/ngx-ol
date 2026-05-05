import { Component, OnDestroy, OnInit, signal, input } from '@angular/core';
import DragZoom from 'ol/interaction/DragZoom';
import { Options } from 'ol/interaction/DragZoom';
import { MapComponent } from '../map.component';
import { Condition } from 'ol/events/condition';

@Component({
  selector: 'aol-interaction-dragzoom',
  template: '',
})
export class DragZoomInteractionComponent implements OnInit, OnDestroy {
  className = input<string>();
  condition = input<Condition>();
  duration = input<number>();
  out = input<boolean>();

  instance: DragZoom;

  protected readonly _instanceSignal = signal<DragZoom | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: DragZoom): DragZoom {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(private map: MapComponent) {}

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
