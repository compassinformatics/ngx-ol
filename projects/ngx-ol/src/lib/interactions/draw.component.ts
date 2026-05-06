import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  signal,
  output,
  input,
} from '@angular/core';
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
export class DrawInteractionComponent implements OnInit, OnChanges, OnDestroy {
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
  olChange = output<BaseEvent>();
  olChangeActive = output<ObjectEvent>();
  olDrawAbort = output<DrawEvent>();
  drawEnd = output<DrawEvent>();
  drawStart = output<DrawEvent>();
  olError = output<BaseEvent>();
  propertyChange = output<ObjectEvent>();
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
    this.setInstance(new Draw(this.createOptions()));
    this.bindInstanceEvents();
    this.map.instance.addInteraction(this.instance);
  }

  private reloadInstance() {
    this.map.instance.removeInteraction(this.instance);
    this.initializeInstance();
  }

  private bindInstanceEvents() {
    this.instance.on('change', (event: BaseEvent) => this.olChange.emit(event));
    this.instance.on('change:active', (event: ObjectEvent) => this.olChangeActive.emit(event));
    this.instance.on('drawabort', (event: DrawEvent) => this.olDrawAbort.emit(event));
    this.instance.on('drawend', (event: DrawEvent) => this.drawEnd.emit(event));
    this.instance.on('drawstart', (event: DrawEvent) => this.drawStart.emit(event));
    this.instance.on('error', (event: BaseEvent) => this.olError.emit(event));
    this.instance.on('propertychange', (event: ObjectEvent) => this.propertyChange.emit(event));
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
