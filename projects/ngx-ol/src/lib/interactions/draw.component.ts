import { Component, OnDestroy, OnInit, EventEmitter, Output, signal, input } from '@angular/core';
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
  clickTolerance = input<number>();
  features = input<Collection<Feature>>();
  source = input<Vector>();
  dragVertexDelay = input<number>();
  snapTolerance = input<number>();
  stopClick = input<boolean>();
  type = input.required<Type>();
  maxPoints = input<number>();
  minPoints = input<number>();
  finishCondition = input<Condition>();
  style = input<StyleLike | FlatStyleLike | undefined>();
  geometryFunction = input<GeometryFunction>();
  geometryName = input<string>();
  condition = input<Condition>();
  freehandCondition = input<Condition>();
  freehand = input<boolean>();
  trace = input<boolean | Condition>();
  traceSource = input<Vector>();
  wrapX = input<boolean>();
  geometryLayout = input<GeometryLayout>();

  @Output() olChange = new EventEmitter<BaseEvent>();
  @Output() olChangeActive = new EventEmitter<ObjectEvent>();
  @Output() olDrawAbort = new EventEmitter<DrawEvent>();
  @Output() drawEnd = new EventEmitter<DrawEvent>();
  @Output() drawStart = new EventEmitter<DrawEvent>();
  @Output() olError = new EventEmitter<BaseEvent>();
  @Output() propertyChange = new EventEmitter<ObjectEvent>();

  instance: Draw;

  protected readonly _instanceSignal = signal<Draw | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Draw): Draw {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.setInstance(new Draw(this.createOptions()));
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
      clickTolerance: this.clickTolerance(),
      features: this.features(),
      source: this.source(),
      dragVertexDelay: this.dragVertexDelay(),
      snapTolerance: this.snapTolerance(),
      stopClick: this.stopClick(),
      type: this.type(),
      maxPoints: this.maxPoints(),
      minPoints: this.minPoints(),
      finishCondition: this.finishCondition(),
      style: this.style(),
      geometryFunction: this.geometryFunction(),
      geometryName: this.geometryName(),
      condition: this.condition(),
      freehandCondition: this.freehandCondition(),
      freehand: this.freehand(),
      trace: this.trace(),
      traceSource: this.traceSource(),
      wrapX: this.wrapX(),
      geometryLayout: this.geometryLayout(),
    };
  }
}
