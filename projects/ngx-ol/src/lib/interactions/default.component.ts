import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { defaults } from 'ol/interaction/defaults';
import Interaction from 'ol/interaction/Interaction';
import { DefaultsOptions } from 'ol/interaction/defaults';
import Collection from 'ol/Collection';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-default',
  template: '',
})
export class DefaultInteractionComponent implements OnInit, OnDestroy {
  @Input() altShiftDragRotate?: boolean;
  @Input() onFocusOnly?: boolean;
  @Input() doubleClickZoom?: boolean;
  @Input() keyboard?: boolean;
  @Input() mouseWheelZoom?: boolean;
  @Input() shiftDragZoom?: boolean;
  @Input() dragPan?: boolean;
  @Input() pinchRotate?: boolean;
  @Input() pinchZoom?: boolean;
  @Input() zoomDelta?: number;
  @Input() zoomDuration?: number;

  instance: Collection<Interaction>;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = defaults(this.createOptions());
    this.instance.forEach((i) => this.map.instance.addInteraction(i));
  }

  ngOnDestroy() {
    this.instance.forEach((i) => this.map.instance.removeInteraction(i));
  }

  private createOptions(): DefaultsOptions {
    return {
      altShiftDragRotate: this.altShiftDragRotate,
      onFocusOnly: this.onFocusOnly,
      doubleClickZoom: this.doubleClickZoom,
      keyboard: this.keyboard,
      mouseWheelZoom: this.mouseWheelZoom,
      shiftDragZoom: this.shiftDragZoom,
      dragPan: this.dragPan,
      pinchRotate: this.pinchRotate,
      pinchZoom: this.pinchZoom,
      zoomDelta: this.zoomDelta,
      zoomDuration: this.zoomDuration,
    };
  }
}
