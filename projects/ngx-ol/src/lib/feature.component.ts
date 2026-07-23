import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  input,
  output,
  signal,
  inject,
} from '@angular/core';
import Feature from 'ol/Feature.js';
import MapBrowserEvent from 'ol/MapBrowserEvent.js';
import { SourceVectorComponent } from './sources/vector.component';

@Component({
  selector: 'aol-feature',
  template: ` <ng-content></ng-content> `,
})
export class FeatureComponent implements OnInit, OnDestroy, OnChanges {
  readonly id = input<string | number | undefined>();

  readonly properties = input<Record<any, any>>();

  readonly feature = input<Feature>();

  readonly clickable = input<boolean>();

  readonly olClick = output<{ event: MapBrowserEvent<MouseEvent> | any; feature: Feature }>();
  readonly singleClick = output<{ event: MapBrowserEvent<MouseEvent> | any; feature: Feature }>();
  readonly dblClick = output<{ event: MapBrowserEvent<MouseEvent> | any; feature: Feature }>();

  readonly componentType: string = 'feature';
  public instance: Feature;

  protected readonly _instanceSignal = signal<Feature | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Feature): Feature {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }
  private readonly host = inject(SourceVectorComponent);

  ngOnInit() {
    this.setInstance(this.feature() || new Feature());
    this.syncProperties(this.properties());
    this.syncId();
    this.syncClickable();
    this.host.instance.addFeature(this.instance);
  }

  ngOnDestroy() {
    this.instance.set('__aol-feature', null);
    this.host.instance.removeFeature(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    const { feature, clickable, id, properties } = changes;

    if (feature && !feature.firstChange) {
      this.instance.set('__aol-feature', null);
      this.host.instance.removeFeature(this.instance);
      this.setInstance(feature.currentValue || new Feature());
      this.syncProperties(this.properties());
      this.syncId();
      this.syncClickable();
      this.host.instance.addFeature(this.instance);
    }

    if (id && !id.firstChange) {
      this.syncId();
    }

    if (properties && !properties.firstChange && !(feature && !feature.firstChange)) {
      this.syncProperties(properties.currentValue, properties.previousValue);
    }

    if (clickable && !clickable.firstChange) {
      this.syncClickable();
    }
  }

  private syncId() {
    this.instance.setId(this.id());
  }

  private syncClickable() {
    this.instance.set('__aol-feature', this.clickable() ? this : null);
  }

  private syncProperties(nextProperties?: Record<any, any>, previousProperties?: Record<any, any>) {
    if (previousProperties) {
      const nextKeys = new Set(Object.keys(nextProperties ?? {}));
      Object.keys(previousProperties)
        .filter((key) => !nextKeys.has(key))
        .forEach((key) => this.instance.unset(key));
    }

    if (nextProperties) {
      this.instance.setProperties(nextProperties);
    }
  }
}
