import { Component, Input, OnChanges, OnInit, SimpleChanges, signal } from '@angular/core';
import Geometry from 'ol/geom/Geometry';
import GeometryCollection from 'ol/geom/GeometryCollection';
import { FeatureComponent } from '../feature.component';

@Component({
  selector: 'aol-geometry-collection',
  template: ` <ng-content></ng-content> `,
})
export class GeometryCollectionComponent implements OnInit, OnChanges {
  @Input() geometries: Geometry[] = [];

  public componentType = 'geometry-collection';

  instance: GeometryCollection;

  protected readonly _instanceSignal = signal<
    GeometryCollection | undefined
  >(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: GeometryCollection): GeometryCollection {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(private host: FeatureComponent) {}

  ngOnInit() {
    this.setInstance(new GeometryCollection(this.geometries));
    this.host.instance.setGeometry(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.geometries && this.instance) {
      this.instance.setGeometries(changes.geometries.currentValue);
    }
  }
}
