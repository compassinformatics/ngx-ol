import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, signal, input } from '@angular/core';
import DblClickDragZoom from 'ol/interaction/DblClickDragZoom';
import type { Options } from 'ol/interaction/DblClickDragZoom';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-dblclickdragzoom',
  template: '',
})
export class DblClickDragZoomInteractionComponent implements OnInit, OnChanges, OnDestroy {
  duration = input<number>();

  delta = input<number>();

  stopDown = input<(handled: boolean) => boolean>();

  instance: DblClickDragZoom;

  protected readonly _instanceSignal = signal<DblClickDragZoom | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: DblClickDragZoom): DblClickDragZoom {
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
    this.setInstance(new DblClickDragZoom(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  private reloadInstance() {
    this.map.instance.removeInteraction(this.instance);
    this.initializeInstance();
  }

  private createOptions(): Options {
    return {
      duration: this.duration(),
      delta: this.delta(),
      stopDown: this.stopDown(),
    };
  }
}
