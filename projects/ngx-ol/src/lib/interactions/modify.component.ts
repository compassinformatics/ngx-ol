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
import Modify from 'ol/interaction/Modify';
import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import Vector from 'ol/source/Vector';
import { ModifyEvent, Options } from 'ol/interaction/Modify';
import { StyleLike } from 'ol/style/Style';
import { Condition } from 'ol/events/condition';
import { ObjectEvent } from 'ol/Object';
import BaseEvent from 'ol/events/Event';
import { FlatStyleLike } from 'ol/style/flat';
import BaseVectorLayer from 'ol/layer/BaseVector';

@Component({
  selector: 'aol-interaction-modify',
  template: '',
})
export class ModifyInteractionComponent implements OnInit, OnChanges, OnDestroy {
  readonly condition = input<Condition>();
  readonly deleteCondition = input<Condition>();
  readonly insertVertexCondition = input<Condition>();
  readonly pixelTolerance = input<number>();
  readonly style = input<StyleLike | FlatStyleLike | undefined>();
  readonly features = input<Collection<Feature>>();
  readonly wrapX = input<boolean>();
  readonly source = input<Vector>();
  readonly hitDetection = input<boolean | BaseVectorLayer<any, any, any>>();
  readonly snapToPointer = input<boolean>();
  readonly olChange = output<BaseEvent>();
  readonly olChangeActive = output<ObjectEvent>();
  readonly olError = output<BaseEvent>();
  readonly olModifyEnd = output<ModifyEvent>();
  readonly olModifyStart = output<ModifyEvent>();
  readonly propertyChange = output<ObjectEvent>();
  instance: Modify;
  protected readonly _instanceSignal = signal<Modify | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Modify): Modify {
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
    this.setInstance(new Modify(this.createOptions()));
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
    this.instance.on('error', (event: BaseEvent) => this.olError.emit(event));
    this.instance.on('modifyend', (event: ModifyEvent) => this.olModifyEnd.emit(event));
    this.instance.on('modifystart', (event: ModifyEvent) => this.olModifyStart.emit(event));
    this.instance.on('propertychange', (event: ObjectEvent) => this.propertyChange.emit(event));
  }

  private createOptions(): Options {
    return {
      condition: this.condition(),
      deleteCondition: this.deleteCondition(),
      insertVertexCondition: this.insertVertexCondition(),
      pixelTolerance: this.pixelTolerance(),
      style: this.style(),
      features: this.features(),
      wrapX: this.wrapX(),
      source: this.source(),
      hitDetection: this.hitDetection(),
      snapToPointer: this.snapToPointer(),
    };
  }
}
