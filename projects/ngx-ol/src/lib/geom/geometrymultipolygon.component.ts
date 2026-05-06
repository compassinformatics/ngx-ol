import { Component, OnInit, signal } from '@angular/core';
import { FeatureComponent } from '../feature.component';
import { SimpleGeometryComponent } from './simplegeometry.component';
import { MapComponent } from '../map.component';
import MultiPolygon from 'ol/geom/MultiPolygon';

@Component({
  selector: 'aol-geometry-multipolygon',
  template: ` <ng-content></ng-content> `,
})
export class GeometryMultiPolygonComponent extends SimpleGeometryComponent implements OnInit {
  readonly componentType: string = 'geometry-multipolygon';
  instance: MultiPolygon;
  protected readonly _instanceSignal = signal<MultiPolygon | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: MultiPolygon): MultiPolygon {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(map: MapComponent, host: FeatureComponent) {
    super(map, host);
  }

  ngOnInit() {
    this.setInstance(
      new MultiPolygon([
        [
          [
            [0, 0],
            [1, 1],
            [0, 1],
          ],
        ],
      ]),
    );
    super.ngOnInit();
  }
}
