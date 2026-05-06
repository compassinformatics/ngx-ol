import { Component, OnInit, signal } from '@angular/core';
import { FeatureComponent } from '../feature.component';
import { SimpleGeometryComponent } from './simplegeometry.component';
import { MapComponent } from '../map.component';
import LineString from 'ol/geom/LineString';

@Component({
  selector: 'aol-geometry-linestring',
  template: ` <ng-content></ng-content> `,
})
export class GeometryLinestringComponent extends SimpleGeometryComponent implements OnInit {
  readonly componentType: string = 'geometry-linestring';
  instance: LineString;
  protected readonly _instanceSignal = signal<LineString | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: LineString): LineString {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(map: MapComponent, host: FeatureComponent) {
    super(map, host);
  }

  ngOnInit() {
    this.setInstance(
      new LineString([
        [0, 0],
        [1, 1],
      ]),
    );
    super.ngOnInit();
  }
}
