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
  readonly clickTolerance = input<number>();
  readonly features = input<Collection<Feature>>();
  readonly source = input<Vector>();
  readonly dragVertexDelay = input<number>();
  readonly snapTolerance = input<number>();
  readonly stopClick = input<boolean>();
  readonly type = input.required<Type>();
  readonly maxPoints = input<number>();
  readonly minPoints = input<number>();
  readonly finishCondition = input<Condition>();
  readonly style = input<StyleLike | FlatStyleLike | undefined>();
  readonly geometryFunction = input<GeometryFunction>();
  readonly geometryName = input<string>();
  readonly condition = input<Condition>();
  readonly freehandCondition = input<Condition>();
  readonly freehand = input<boolean>();
  readonly trace = input<boolean | Condition>();
  readonly traceSource = input<Vector>();
  readonly wrapX = input<boolean>();
  readonly geometryLayout = input<GeometryLayout>();
  readonly olChange = output<BaseEvent>();
  readonly olChangeActive = output<ObjectEvent>();
  readonly olDrawAbort = output<DrawEvent>();
  readonly drawEnd = output<DrawEvent>();
  readonly drawStart = output<DrawEvent>();
  readonly olError = output<BaseEvent>();
  readonly propertyChange = output<ObjectEvent>();
  instance: Draw;
  protected readonly _instanceSignal = signal<Draw | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Draw): Draw {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(private readonly map: MapComponent) {}

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
