import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import Geometry from 'ol/geom/Geometry';
import GeometryCollection from 'ol/geom/GeometryCollection';
import { FeatureComponent } from '../feature.component';

@Component({
  selector: 'aol-geometry-collection',
  template: ` <ng-content></ng-content> `,
})
export class GeometryCollectionComponent implements OnInit, OnChanges {
  @Input()
  geometries: Geometry[] = [];

  public componentType = 'geometry-collection';
  public instance: GeometryCollection;

  constructor(private host: FeatureComponent) {}

  ngOnInit() {
    this.instance = new GeometryCollection(this.geometries);
    this.host.instance.setGeometry(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.geometries && this.instance) {
      this.instance.setGeometries(changes.geometries.currentValue);
    }
  }
}
