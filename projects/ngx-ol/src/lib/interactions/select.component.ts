import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapComponent } from '../map.component';
import { Select } from 'ol/interaction';
import { Layer } from 'ol/layer';
import { Collection, Feature } from 'ol';
import { SelectEvent, FilterFunction } from 'ol/interaction/Select';
import { StyleLike } from 'ol/style/Style';
import { Condition } from 'ol/events/condition';
import { ObjectEvent } from 'ol/Object';
import BaseEvent from 'ol/events/Event';

@Component({
  selector: 'aol-interaction-select',
  template: '',
})
export class SelectInteractionComponent implements OnInit, OnDestroy {
  @Input()
  addCondition?: Condition;
  @Input()
  condition?: Condition;
  @Input()
  layers?: Layer[] | ((layer: Layer) => boolean);
  @Input()
  style?: StyleLike | null | undefined;
  @Input()
  removeCondition?: Condition;
  @Input()
  toggleCondition?: Condition;
  @Input()
  multi?: boolean;
  @Input()
  features?: Collection<Feature>;
  @Input()
  filter?: FilterFunction;
  @Input()
  wrapX?: boolean;

  @Output()
  olChange = new EventEmitter<BaseEvent>();
  @Output()
  olChangeActive = new EventEmitter<ObjectEvent>();
  @Output()
  olError = new EventEmitter<BaseEvent>();
  @Output()
  propertyChange = new EventEmitter<ObjectEvent>();
  @Output()
  olSelect = new EventEmitter<SelectEvent>();

  instance: Select;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new Select(this);

    this.instance.on('change', (event: BaseEvent) => this.olChange.emit(event));
    this.instance.on('change:active', (event: ObjectEvent) => this.olChangeActive.emit(event));
    this.instance.on('error', (event: BaseEvent) => this.olError.emit(event));
    this.instance.on('propertychange', (event: ObjectEvent) => this.propertyChange.emit(event));
    this.instance.on('select', (event: SelectEvent) => this.olSelect.emit(event));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }
}
