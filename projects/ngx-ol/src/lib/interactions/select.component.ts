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
import Select from 'ol/interaction/Select.js';
import Layer from 'ol/layer/Layer.js';
import Collection from 'ol/Collection.js';
import Feature from 'ol/Feature.js';
import { SelectEvent, FilterFunction, Options } from 'ol/interaction/Select.js';
import { StyleLike } from 'ol/style/Style.js';
import { Condition } from 'ol/events/condition.js';
import { ObjectEvent } from 'ol/Object.js';
import BaseEvent from 'ol/events/Event.js';

@Component({
  selector: 'aol-interaction-select',
  template: '',
})
export class SelectInteractionComponent implements OnInit, OnChanges, OnDestroy {
  readonly addCondition = input<Condition>();
  readonly condition = input<Condition>();
  readonly layers = input<Layer[] | ((layer: Layer) => boolean)>();
  readonly style = input<StyleLike | null | undefined>();
  readonly removeCondition = input<Condition>();
  readonly toggleCondition = input<Condition>();
  readonly multi = input<boolean>();
  readonly features = input<Collection<Feature>>();
  readonly filter = input<FilterFunction>();
  readonly hitTolerance = input<number>();

  readonly olChange = output<BaseEvent>();
  readonly changeActive = output<ObjectEvent>();
  readonly olError = output<BaseEvent>();
  readonly propertyChange = output<ObjectEvent>();
  readonly olSelect = output<SelectEvent>();

  instance: Select;

  protected readonly _instanceSignal = signal<Select | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Select): Select {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  private readonly map = inject(MapComponent);

  ngOnInit() {
    this.setInstance(new Select(this.createOptions()));

    this.instance.on('change', (event: BaseEvent) => this.olChange.emit(event));
    this.instance.on('change:active', (event: ObjectEvent) => this.changeActive.emit(event));
    this.instance.on('error', (event: BaseEvent) => this.olError.emit(event));
    this.instance.on('propertychange', (event: ObjectEvent) => this.propertyChange.emit(event));
    this.instance.on('select', (event: SelectEvent) => this.olSelect.emit(event));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.instance && changes.hitTolerance?.currentValue !== undefined) {
      this.instance.setHitTolerance(changes.hitTolerance.currentValue);
    }
  }

  private createOptions(): Options {
    return {
      addCondition: this.addCondition(),
      condition: this.condition(),
      layers: this.layers(),
      style: this.style(),
      removeCondition: this.removeCondition(),
      toggleCondition: this.toggleCondition(),
      multi: this.multi(),
      features: this.features(),
      filter: this.filter(),
      hitTolerance: this.hitTolerance(),
    };
  }
}
