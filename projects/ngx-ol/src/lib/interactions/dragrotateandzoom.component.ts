import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, signal, input } from '@angular/core';
import DragRotateAndZoom from 'ol/interaction/DragRotateAndZoom';
import { Options } from 'ol/interaction/DragRotateAndZoom';
import { MapComponent } from '../map.component';
import { Condition } from 'ol/events/condition';

@Component({
  selector: 'aol-interaction-dragrotateandzoom',
  template: '',
})
export class DragRotateAndZoomInteractionComponent implements OnInit, OnChanges, OnDestroy {
  condition = input<Condition>();
  duration = input<number>();
  instance: DragRotateAndZoom;
  protected readonly _instanceSignal = signal<DragRotateAndZoom | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: DragRotateAndZoom): DragRotateAndZoom {
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
    this.setInstance(new DragRotateAndZoom(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  private reloadInstance() {
    this.map.instance.removeInteraction(this.instance);
    this.initializeInstance();
  }

  private createOptions(): Options {
    return {
      condition: this.condition(),
      duration: this.duration(),
    };
  }
}
