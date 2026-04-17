import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Translate } from 'ol/interaction';
import { Collection, Feature } from 'ol';
import { Layer } from 'ol/layer';
import { TranslateEvent } from 'ol/interaction/Translate';
import { MapComponent } from '../map.component';
import BaseEvent from 'ol/events/Event';
import { ObjectEvent } from 'ol/Object';

@Component({
  selector: 'aol-interaction-translate',
  template: '',
})
export class TranslateInteractionComponent implements OnInit, OnDestroy {
  @Input()
  features?: Collection<Feature>;
  @Input()
  layers?: Layer[] | ((layer: Layer) => boolean);
  @Input()
  hitTolerance?: number;

  @Output()
  olChange = new EventEmitter<BaseEvent>();
  @Output()
  olChangeActive = new EventEmitter<ObjectEvent>();
  @Output()
  olError = new EventEmitter<BaseEvent>();
  @Output()
  propertyChange = new EventEmitter<ObjectEvent>();
  @Output()
  translateEnd = new EventEmitter<TranslateEvent>();
  @Output()
  translateStart = new EventEmitter<TranslateEvent>();
  @Output()
  translating = new EventEmitter<TranslateEvent>();

  instance: Translate;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new Translate(this);

    this.instance.on('change', (event: BaseEvent) => this.olChange.emit(event));
    this.instance.on('change:active', (event: ObjectEvent) => this.olChangeActive.emit(event));
    this.instance.on('error', (event: BaseEvent) => this.olError.emit(event));
    this.instance.on('propertychange', (event: ObjectEvent) => this.propertyChange.emit(event));
    this.instance.on('translateend', (event: TranslateEvent) => this.translateEnd.emit(event));
    this.instance.on('translatestart', (event: TranslateEvent) => this.translateStart.emit(event));
    this.instance.on('translating', (event: TranslateEvent) => this.translating.emit(event));

    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }
}
