import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import DblClickDragZoom from 'ol/interaction/DblClickDragZoom';
import type { Options } from 'ol/interaction/DblClickDragZoom';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-dblclickdragzoom',
  template: '',
})
export class DblClickDragZoomInteractionComponent implements OnInit, OnDestroy {
  @Input() duration?: number;

  @Input() delta?: number;

  @Input() stopDown?: (handled: boolean) => boolean;

  instance: DblClickDragZoom;

  protected readonly _instanceSignal = signal<
    DblClickDragZoom | undefined
  >(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: DblClickDragZoom): DblClickDragZoom {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.setInstance(new DblClickDragZoom(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      duration: this.duration,
      delta: this.delta,
      stopDown: this.stopDown,
    };
  }
}
