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

  olChange = output<BaseEvent>();
  changeActive = output<ObjectEvent>();
  olError = output<BaseEvent>();
  propertyChange = output<ObjectEvent>();
  translateEnd = output<TranslateEvent>();
  translateStart = output<TranslateEvent>();
  translating = output<TranslateEvent>();

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
