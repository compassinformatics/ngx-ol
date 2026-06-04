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
    if (this.properties()) {
      this.instance.setProperties(this.properties()!);
    }
    if (this.id() !== undefined) {
      this.instance.setId(this.id());
    }
    if (this.clickable()) {
      this.instance.set('__aol-feature', this);
    }
    this.host.instance.addFeature(this.instance);
  }

  ngOnDestroy() {
    this.instance.set('__aol-feature', null);
    this.host.instance.removeFeature(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    const { feature, clickable } = changes;
    if (this.instance) {
      this.instance.setId(this.id());
    }

    if (feature && !feature.firstChange) {
      this.instance.set('__aol-feature', null);
      this.host.instance.removeFeature(this.instance);
      this.setInstance(feature.currentValue);
      if (this.clickable()) {
        this.instance.set('__aol-feature', this);
      }
      this.host.instance.addFeature(this.instance);
    }

    if (clickable && !clickable.firstChange) {
      this.instance.set('__aol-feature', clickable.currentValue ? this : null);
    }
  }
}
