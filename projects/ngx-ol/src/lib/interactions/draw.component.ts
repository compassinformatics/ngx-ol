import { Component, Input, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { MapComponent } from '../map.component';
import { Draw } from 'ol/interaction';
import { Collection, Feature } from 'ol';
import { Vector } from 'ol/source';
import { Style } from 'ol/style';
import { DrawEvent, GeometryFunction } from 'ol/interaction/Draw';
import { StyleFunction, StyleLike } from 'ol/style/Style';
import { Condition } from 'ol/events/condition';
import { Type } from 'ol/geom/Geometry';
import { ObjectEvent } from 'ol/Object';
import BaseEvent from 'ol/events/Event';
import { FlatStyleLike } from 'ol/style/flat';

@Component({
  selector: 'aol-interaction-draw',
  template: '',
})
export class DrawInteractionComponent implements OnInit, OnDestroy {
  @Input()
  clickTolerance?: number;
  @Input()
  features?: Collection<Feature>;
  @Input()
  source?: Vector;
  @Input()
  snapTolerance?: number;
  @Input()
  type: Type;
  @Input()
  maxPoints?: number;
  @Input()
  minPoints?: number;
  @Input()
  finishCondition?: Condition;
  @Input()
  style?: StyleLike | FlatStyleLike | undefined;
  @Input()
  geometryFunction?: GeometryFunction;
  @Input()
  geometryName?: string;
  @Input()
  condition?: Condition;
  @Input()
  freehandCondition?: Condition;
  @Input()
  freehand?: boolean;
  @Input()
  wrapX?: boolean;

  @Output()
  olChange = new EventEmitter<BaseEvent>();
  @Output()
  olChangeActive = new EventEmitter<ObjectEvent>();
  @Output()
  olDrawAbort = new EventEmitter<DrawEvent>();
  @Output()
  drawEnd = new EventEmitter<DrawEvent>();
  @Output()
  drawStart = new EventEmitter<DrawEvent>();
  @Output()
  olError = new EventEmitter<BaseEvent>();
  @Output()
  propertyChange = new EventEmitter<ObjectEvent>();

  instance: Draw;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new Draw(this);
    this.instance.on('change', (event: BaseEvent) => this.olChange.emit(event));
    this.instance.on('change:active', (event: ObjectEvent) => this.olChangeActive.emit(event));
    this.instance.on('drawabort', (event: DrawEvent) => this.olDrawAbort.emit(event));
    this.instance.on('drawend', (event: DrawEvent) => this.drawEnd.emit(event));
    this.instance.on('drawstart', (event: DrawEvent) => this.drawStart.emit(event));
    this.instance.on('error', (event: BaseEvent) => this.olError.emit(event));
    this.instance.on('propertychange', (event: ObjectEvent) => this.propertyChange.emit(event));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }
}
