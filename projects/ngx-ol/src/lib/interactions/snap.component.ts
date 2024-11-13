import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import BaseEvent from 'ol/events/Event';
import { SnapEvent } from 'ol/events/SnapEvent';
import { Snap } from 'ol/interaction';
import { ObjectEvent } from 'ol/Object';
import { MapComponent } from '../map.component';
import { Collection, Feature } from 'ol';
import { Vector } from 'ol/source';

@Component({
  selector: 'aol-interaction-snap',
  template: '',
})
export class SnapInteractionComponent implements OnInit, OnDestroy {
  @Input()
  features?: Collection<Feature>;
  @Input()
  edge: boolean;
  @Input()
  vertex: boolean;
  @Input()
  pixelTolerance?: number;
  @Input()
  source?: Vector;

  @Output()
  olChange = new EventEmitter<BaseEvent>();
  @Output()
  olChangeActive = new EventEmitter<ObjectEvent>();
  @Output()
  olError = new EventEmitter<BaseEvent>();
  @Output()
  propertyChange = new EventEmitter<ObjectEvent>();
  @Output()
  olSnap = new EventEmitter<SnapEvent>();

  instance: Snap;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new Snap(this);

    this.instance.on('change', (event: BaseEvent) => this.olChange.emit(event));
    this.instance.on('change:active', (event: ObjectEvent) => this.olChangeActive.emit(event));
    this.instance.on('error', (event: BaseEvent) => this.olError.emit(event));
    this.instance.on('propertychange', (event: ObjectEvent) => this.propertyChange.emit(event));
    this.instance.on('snap', (event: SnapEvent) => this.olSnap.emit(event));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }
}
