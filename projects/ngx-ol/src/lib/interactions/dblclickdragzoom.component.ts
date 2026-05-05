import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new DblClickDragZoom(this.createOptions());
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
