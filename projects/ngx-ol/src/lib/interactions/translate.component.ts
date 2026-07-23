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
import Translate from 'ol/interaction/Translate.js';
import Collection from 'ol/Collection.js';
import Feature from 'ol/Feature.js';
import Layer from 'ol/layer/Layer.js';
import { Options, TranslateEvent } from 'ol/interaction/Translate.js';
import { MapComponent } from '../map.component';
import BaseEvent from 'ol/events/Event.js';
import { ObjectEvent } from 'ol/Object.js';
import { Condition } from 'ol/events/condition.js';
import { FilterFunction } from 'ol/interaction/Select.js';

@Component({
  selector: 'aol-interaction-translate',
  template: '',
})
export class TranslateInteractionComponent implements OnInit, OnChanges, OnDestroy {
  readonly condition = input<Condition>();
  readonly features = input<Collection<Feature>>();
  readonly layers = input<Layer[] | ((layer: Layer) => boolean)>();
  readonly filter = input<FilterFunction>();
  readonly hitTolerance = input<number>();

  readonly olChange = output<BaseEvent>();
  readonly changeActive = output<ObjectEvent>();
  readonly olError = output<BaseEvent>();
  readonly propertyChange = output<ObjectEvent>();
  readonly translateEnd = output<TranslateEvent>();
  readonly translateStart = output<TranslateEvent>();
  readonly translating = output<TranslateEvent>();

  instance: Translate;

  protected readonly _instanceSignal = signal<Translate | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Translate): Translate {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  private readonly map = inject(MapComponent);

  ngOnInit() {
    this.setInstance(new Translate(this.createOptions()));

    this.instance.on('change', (event: BaseEvent) => this.olChange.emit(event));
    this.instance.on('change:active', (event: ObjectEvent) => this.changeActive.emit(event));
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

  ngOnChanges(changes: SimpleChanges) {
    if (this.instance && changes.hitTolerance?.currentValue !== undefined) {
      this.instance.setHitTolerance(changes.hitTolerance.currentValue);
    }
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
