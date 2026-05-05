import { Component, OnDestroy, OnInit, Input, Output, EventEmitter, signal } from '@angular/core';
import { MapComponent } from '../map.component';
import Select from 'ol/interaction/Select';
import Layer from 'ol/layer/Layer';
import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import { SelectEvent, FilterFunction, Options } from 'ol/interaction/Select';
import { StyleLike } from 'ol/style/Style';
import { Condition } from 'ol/events/condition';
import { ObjectEvent } from 'ol/Object';
import BaseEvent from 'ol/events/Event';

@Component({
  selector: 'aol-interaction-select',
  template: '',
})
export class SelectInteractionComponent implements OnInit, OnDestroy {
  @Input() addCondition?: Condition;
  @Input() condition?: Condition;
  @Input() layers?: Layer[] | ((layer: Layer) => boolean);
  @Input() style?: StyleLike | null | undefined;
  @Input() removeCondition?: Condition;
  @Input() toggleCondition?: Condition;
  @Input() multi?: boolean;
  @Input() features?: Collection<Feature>;
  @Input() filter?: FilterFunction;
  @Input() hitTolerance?: number;

  @Output() olChange = new EventEmitter<BaseEvent>();
  @Output() olChangeActive = new EventEmitter<ObjectEvent>();
  @Output() olError = new EventEmitter<BaseEvent>();
  @Output() propertyChange = new EventEmitter<ObjectEvent>();
  @Output() olSelect = new EventEmitter<SelectEvent>();

  instance: Select;

  protected readonly _instanceSignal = signal<Select | undefined>(
    undefined,
  );

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Select): Select {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.setInstance(new Select(this.createOptions()));

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

  private createOptions(): Options {
    return {
      addCondition: this.addCondition,
      condition: this.condition,
      layers: this.layers,
      style: this.style,
      removeCondition: this.removeCondition,
      toggleCondition: this.toggleCondition,
      multi: this.multi,
      features: this.features,
      filter: this.filter,
      hitTolerance: this.hitTolerance,
    };
  }
}
