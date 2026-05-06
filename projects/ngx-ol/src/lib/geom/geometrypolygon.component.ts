import { Component, OnInit, signal } from '@angular/core';
import { FeatureComponent } from '../feature.component';
import { SimpleGeometryComponent } from './simplegeometry.component';
import { MapComponent } from '../map.component';
import Polygon from 'ol/geom/Polygon';

@Component({
  selector: 'aol-geometry-polygon',
  template: ` <ng-content></ng-content> `,
})
export class GeometryPolygonComponent extends SimpleGeometryComponent implements OnInit {
  readonly componentType: string = 'geometry-polygon';
  instance: Polygon;
  protected readonly _instanceSignal = signal<Polygon | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Polygon): Polygon {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(map: MapComponent, host: FeatureComponent) {
    super(map, host);
  }

  ngOnInit() {
    this.setInstance(
      new Polygon([
        [
          [0, 0],
          [1, 1],
          [0, 1],
        ],
      ]),
    );
    super.ngOnInit();
  }
}
