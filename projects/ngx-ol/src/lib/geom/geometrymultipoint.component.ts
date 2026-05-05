import { Component, OnInit, signal } from '@angular/core';
import { FeatureComponent } from '../feature.component';
import { SimpleGeometryComponent } from './simplegeometry.component';
import { MapComponent } from '../map.component';
import MultiPoint from 'ol/geom/MultiPoint';

@Component({
  selector: 'aol-geometry-multipoint',
  template: ` <ng-content></ng-content> `,
})
export class GeometryMultiPointComponent extends SimpleGeometryComponent implements OnInit {
  public componentType = 'geometry-multipoint';
  instance: MultiPoint;

  protected readonly _instanceSignal = signal<MultiPoint | undefined>(
    undefined,
  );

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: MultiPoint): MultiPoint {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(map: MapComponent, host: FeatureComponent) {
    super(map, host);
  }

  ngOnInit() {
    this.setInstance(
      new MultiPoint([
        [0, 0],
        [1, 1],
      ]),
    );
    super.ngOnInit();
  }
}
