import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
  signal,
  input,
} from '@angular/core';
import Translate from 'ol/interaction/Translate';
import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import Layer from 'ol/layer/Layer';
import { Options, TranslateEvent } from 'ol/interaction/Translate';
import { MapComponent } from '../map.component';
import BaseEvent from 'ol/events/Event';
import { ObjectEvent } from 'ol/Object';
import { Condition } from 'ol/events/condition';
import { FilterFunction } from 'ol/interaction/Select';

@Component({
  selector: 'aol-interaction-translate',
  template: '',
})
export class TranslateInteractionComponent implements OnInit, OnChanges, OnDestroy {
  condition = input<Condition>();
  features = input<Collection<Feature>>();
  layers = input<Layer[] | ((layer: Layer) => boolean)>();
  filter = input<FilterFunction>();
  hitTolerance = input<number>();

  @Output() olChange = new EventEmitter<BaseEvent>();
  @Output() olChangeActive = new EventEmitter<ObjectEvent>();
  @Output() olError = new EventEmitter<BaseEvent>();
  @Output() propertyChange = new EventEmitter<ObjectEvent>();
  @Output() translateEnd = new EventEmitter<TranslateEvent>();
  @Output() translateStart = new EventEmitter<TranslateEvent>();
  @Output() translating = new EventEmitter<TranslateEvent>();

  instance: Translate;

  protected readonly _instanceSignal = signal<Translate | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Translate): Translate {
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
    this.setInstance(new Translate(this.createOptions()));
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
    this.instance.on('translateend', (event: TranslateEvent) => this.translateEnd.emit(event));
    this.instance.on('translatestart', (event: TranslateEvent) => this.translateStart.emit(event));
    this.instance.on('translating', (event: TranslateEvent) => this.translating.emit(event));
  }

  private createOptions(): Options {
    return {
      condition: this.condition(),
      features: this.features(),
      layers: this.layers(),
      filter: this.filter(),
      hitTolerance: this.hitTolerance(),
    };
  }
}
