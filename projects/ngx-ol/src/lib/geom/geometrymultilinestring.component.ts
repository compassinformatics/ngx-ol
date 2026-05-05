import { Component, OnInit, signal } from '@angular/core';
import { FeatureComponent } from '../feature.component';
import { SimpleGeometryComponent } from './simplegeometry.component';
import { MapComponent } from '../map.component';
import MultiLineString from 'ol/geom/MultiLineString';

@Component({
  selector: 'aol-geometry-multilinestring',
  template: ` <ng-content></ng-content> `,
})
export class GeometryMultiLinestringComponent extends SimpleGeometryComponent implements OnInit {
  public componentType = 'geometry-multilinestring';

  instance: MultiLineString;

  protected readonly _instanceSignal = signal<
    MultiLineString | undefined
  >(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: MultiLineString): MultiLineString {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(map: MapComponent, host: FeatureComponent) {
    super(map, host);
  }

  ngOnInit() {
    this.setInstance(
      new MultiLineString([
        [
          [0, 0],
          [1, 1],
        ],
      ]),
    );
    super.ngOnInit();
  }
}
