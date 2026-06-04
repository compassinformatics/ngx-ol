import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  input,
  output,
  signal,
} from '@angular/core';
import Feature from 'ol/Feature';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { SourceVectorComponent } from './sources/vector.component';

@Component({
  selector: 'aol-feature',
  template: ` <ng-content></ng-content> `,
})
export class FeatureComponent implements OnInit, OnDestroy, OnChanges {
  id = input<string | number | undefined>();

  properties = input<Record<any, any>>();

  feature = input<Feature>();

  clickable = input<boolean>();

  olClick = output<{ event: MapBrowserEvent<MouseEvent> | any; feature: Feature }>();
  singleClick = output<{ event: MapBrowserEvent<MouseEvent> | any; feature: Feature }>();
  dblClick = output<{ event: MapBrowserEvent<MouseEvent> | any; feature: Feature }>();

  public componentType = 'feature';
  public instance: Feature;

  protected readonly _instanceSignal = signal<Feature | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Feature): Feature {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }
  constructor(private host: SourceVectorComponent) {}

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
