import { Component, Input, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { MapComponent } from '../map.component';
import Draw from 'ol/interaction/Draw';
import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import Vector from 'ol/source/Vector';
import { DrawEvent, GeometryFunction, Options } from 'ol/interaction/Draw';
import { StyleFunction, StyleLike } from 'ol/style/Style';
import { Condition } from 'ol/events/condition';
import { Type } from 'ol/geom/Geometry';
import { GeometryLayout } from 'ol/geom/Geometry';
import { ObjectEvent } from 'ol/Object';
import BaseEvent from 'ol/events/Event';
import { FlatStyleLike } from 'ol/style/flat';

@Component({
  selector: 'aol-interaction-draw',
  template: '',
})
export class DrawInteractionComponent implements OnInit, OnDestroy {
  @Input() clickTolerance?: number;
  @Input() features?: Collection<Feature>;
  @Input() source?: Vector;
  @Input() dragVertexDelay?: number;
  @Input() snapTolerance?: number;
  @Input() stopClick?: boolean;
  @Input() type: Type;
  @Input() maxPoints?: number;
  @Input() minPoints?: number;
  @Input() finishCondition?: Condition;
  @Input() style?: StyleLike | FlatStyleLike | undefined;
  @Input() geometryFunction?: GeometryFunction;
  @Input() geometryName?: string;
  @Input() condition?: Condition;
  @Input() freehandCondition?: Condition;
  @Input() freehand?: boolean;
  @Input() trace?: boolean | Condition;
  @Input() traceSource?: Vector;
  @Input() wrapX?: boolean;
  @Input() geometryLayout?: GeometryLayout;

  @Output() olChange = new EventEmitter<BaseEvent>();
  @Output() olChangeActive = new EventEmitter<ObjectEvent>();
  @Output() olDrawAbort = new EventEmitter<DrawEvent>();
  @Output() drawEnd = new EventEmitter<DrawEvent>();
  @Output() drawStart = new EventEmitter<DrawEvent>();
  @Output() olError = new EventEmitter<BaseEvent>();
  @Output() propertyChange = new EventEmitter<ObjectEvent>();

  instance: Draw;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new Draw(this.createOptions());
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

  private createOptions(): Options {
    return {
      clickTolerance: this.clickTolerance,
      features: this.features,
      source: this.source,
      dragVertexDelay: this.dragVertexDelay,
      snapTolerance: this.snapTolerance,
      stopClick: this.stopClick,
      type: this.type,
      maxPoints: this.maxPoints,
      minPoints: this.minPoints,
      finishCondition: this.finishCondition,
      style: this.style,
      geometryFunction: this.geometryFunction,
      geometryName: this.geometryName,
      condition: this.condition,
      freehandCondition: this.freehandCondition,
      freehand: this.freehand,
      trace: this.trace,
      traceSource: this.traceSource,
      wrapX: this.wrapX,
      geometryLayout: this.geometryLayout,
    };
  }
}
