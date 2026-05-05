import {
  signal,
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  input,
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

  @Output() olClick = new EventEmitter<{
    event: MapBrowserEvent<MouseEvent> | any;
    feature: Feature;
  }>();
  @Output() singleClick = new EventEmitter<{
    event: MapBrowserEvent<MouseEvent> | any;
    feature: Feature;
  }>();
  @Output() dblClick = new EventEmitter<{
    event: MapBrowserEvent<MouseEvent> | any;
    feature: Feature;
  }>();

  public componentType = 'feature';
  instance: Feature;

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
    const properties = this.properties();
    if (properties) {
      this.instance.setProperties(properties);
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
