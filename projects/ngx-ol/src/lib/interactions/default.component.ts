import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { defaults, Interaction } from 'ol/interaction';
import { Collection } from 'ol';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-default',
  template: '',
})
export class DefaultInteractionComponent implements OnInit, OnDestroy {
  @Input()
  altShiftDragRotate: boolean;
  @Input()
  onFocusOnly: boolean;
  @Input()
  doubleClickZoom: boolean;
  @Input()
  keyboard: boolean;
  @Input()
  mouseWheelZoom: boolean;
  @Input()
  shiftDragZoom: boolean;
  @Input()
  dragPan: boolean;
  @Input()
  pinchRotate: boolean;
  @Input()
  pinchZoom: boolean;
  @Input()
  zoomDelta: number;
  @Input()
  zoomDuration: number;

  instance: Collection<Interaction>;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = defaults(this);
    this.instance.forEach((i) => this.map.instance.addInteraction(i));
  }

  ngOnDestroy() {
    this.instance.forEach((i) => this.map.instance.removeInteraction(i));
  }
}
