import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input()
  condition?: Condition;
  @Input()
  deleteCondition?: Condition;
  @Input()
  insertVertexCondition?: Condition;
  @Input()
  pixelTolerance?: number;
  @Input()
  style?: StyleLike | FlatStyleLike | undefined;
  @Input()
  features?: Collection<Feature>;
  @Input()
  wrapX?: boolean;
  @Input()
  source?: Vector;
  @Input()
  hitDetection?: boolean | BaseVectorLayer<any, any, any>;
  @Input()
  snapToPointer?: boolean;

  @Output()
  olChange = new EventEmitter<BaseEvent>();
  @Output()
  olChangeActive = new EventEmitter<ObjectEvent>();
  @Output()
  olError = new EventEmitter<BaseEvent>();
  @Output()
  olModifyEnd = new EventEmitter<ModifyEvent>();
  @Output()
  olModifyStart = new EventEmitter<ModifyEvent>();
  @Output()
  propertyChange = new EventEmitter<ObjectEvent>();

  instance: Modify;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new Modify(this.createOptions());
    this.instance.on('change', (event: BaseEvent) => this.olChange.emit(event));
    this.instance.on('change:active', (event: ObjectEvent) => this.olChangeActive.emit(event));
    this.instance.on('error', (event: BaseEvent) => this.olError.emit(event));
    this.instance.on('modifyend', (event: ModifyEvent) => this.olModifyEnd.emit(event));
    this.instance.on('modifystart', (event: ModifyEvent) => this.olModifyStart.emit(event));
    this.instance.on('propertychange', (event: ObjectEvent) => this.propertyChange.emit(event));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      condition: this.condition,
      deleteCondition: this.deleteCondition,
      insertVertexCondition: this.insertVertexCondition,
      pixelTolerance: this.pixelTolerance,
      style: this.style,
      features: this.features,
      wrapX: this.wrapX,
      source: this.source,
      hitDetection: this.hitDetection,
      snapToPointer: this.snapToPointer,
    };
  }
}
