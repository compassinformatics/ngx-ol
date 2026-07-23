import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  input,
  output,
  signal,
  inject,
} from '@angular/core';
import { MapComponent } from '../map.component';
import Draw from 'ol/interaction/Draw.js';
import Collection from 'ol/Collection.js';
import Feature from 'ol/Feature.js';
import Vector from 'ol/source/Vector.js';
import { DrawEvent, GeometryFunction, Options } from 'ol/interaction/Draw.js';
import { StyleLike } from 'ol/style/Style.js';
import { Condition } from 'ol/events/condition.js';
import { Type } from 'ol/geom/Geometry.js';
import { GeometryLayout } from 'ol/geom/Geometry.js';
import { ObjectEvent } from 'ol/Object.js';
import BaseEvent from 'ol/events/Event.js';
import { FlatStyleLike } from 'ol/style/flat.js';

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
  readonly changeActive = output<ObjectEvent>();
  readonly drawAbort = output<DrawEvent>();
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
  private readonly map = inject(MapComponent);

  ngOnInit() {
    this.initializeInstance();
  }

  ngOnChanges(changes: SimpleChanges) {
    const liveUpdateKeys = ['trace'];
    const requiresReload = Object.keys(changes).some(
      (key) => !liveUpdateKeys.includes(key) && !changes[key].firstChange,
    );

    if (this.instance && requiresReload) {
      this.replaceInstance();
      return;
    }

    if (this.instance && changes.trace?.currentValue !== undefined) {
      this.instance.setTrace(changes.trace.currentValue);
    }
  }

  ngOnDestroy() {
    if (this.instance) {
      this.map.instance.removeInteraction(this.instance);
    }
  }

  private initializeInstance() {
    this.setInstance(new Draw(this.createOptions()));
    this.bindInstanceEvents();
    this.map.instance.addInteraction(this.instance);
  }

  private replaceInstance() {
    this.map.instance.removeInteraction(this.instance);
    this.initializeInstance();
  }

  private bindInstanceEvents() {
    this.instance.on('change', (event: BaseEvent) => this.olChange.emit(event));
    this.instance.on('change:active', (event: ObjectEvent) => this.changeActive.emit(event));
    this.instance.on('drawabort', (event: DrawEvent) => this.drawAbort.emit(event));
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
