import { Component, OnDestroy, OnInit, input, output, signal, inject } from '@angular/core';
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
export class ModifyInteractionComponent implements OnInit, OnDestroy {
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
  readonly changeActive = output<ObjectEvent>();
  readonly olError = output<BaseEvent>();
  readonly modifyEnd = output<ModifyEvent>();
  readonly modifyStart = output<ModifyEvent>();
  readonly propertyChange = output<ObjectEvent>();

  instance: Modify;

  protected readonly _instanceSignal = signal<Modify | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Modify): Modify {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  private readonly map = inject(MapComponent);

  ngOnInit() {
    this.setInstance(new Modify(this.createOptions()));
    this.instance.on('change', (event: BaseEvent) => this.olChange.emit(event));
    this.instance.on('change:active', (event: ObjectEvent) => this.changeActive.emit(event));
    this.instance.on('error', (event: BaseEvent) => this.olError.emit(event));
    this.instance.on('modifyend', (event: ModifyEvent) => this.modifyEnd.emit(event));
    this.instance.on('modifystart', (event: ModifyEvent) => this.modifyStart.emit(event));
    this.instance.on('propertychange', (event: ObjectEvent) => this.propertyChange.emit(event));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
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
