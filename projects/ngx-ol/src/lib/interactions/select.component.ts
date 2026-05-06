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
export class SelectInteractionComponent implements OnInit, OnChanges, OnDestroy {
  addCondition = input<Condition>();
  condition = input<Condition>();
  layers = input<Layer[] | ((layer: Layer) => boolean)>();
  style = input<StyleLike | null | undefined>();
  removeCondition = input<Condition>();
  toggleCondition = input<Condition>();
  multi = input<boolean>();
  features = input<Collection<Feature>>();
  filter = input<FilterFunction>();
  hitTolerance = input<number>();
  olChange = output<BaseEvent>();
  olChangeActive = output<ObjectEvent>();
  olError = output<BaseEvent>();
  propertyChange = output<ObjectEvent>();
  olSelect = output<SelectEvent>();
  instance: Select;
  protected readonly _instanceSignal = signal<Select | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Select): Select {
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
    this.setInstance(new Select(this.createOptions()));
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
    this.instance.on('propertychange', (event: ObjectEvent) => this.propertyChange.emit(event));
    this.instance.on('select', (event: SelectEvent) => this.olSelect.emit(event));
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
