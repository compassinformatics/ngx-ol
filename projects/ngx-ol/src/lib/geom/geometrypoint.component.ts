import { Component, OnChanges, OnInit, SimpleChanges, signal, input } from '@angular/core';
import { FeatureComponent } from '../feature.component';
import { SimpleGeometryComponent } from './simplegeometry.component';
import { MapComponent } from '../map.component';
import Point from 'ol/geom/Point';
import { Coordinate } from 'ol/coordinate';
import { GeometryLayout } from 'ol/geom/Geometry';

@Component({
  selector: 'aol-geometry-point',
  template: ` <ng-content></ng-content> `,
})
export class GeometryPointComponent extends SimpleGeometryComponent implements OnInit, OnChanges {
  readonly coordinates = input<Coordinate>([0, 0]);
  readonly layout = input<GeometryLayout>();
  readonly componentType: string = 'geometry-point';
  instance: Point;
  protected readonly _instanceSignal = signal<Point | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Point): Point {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(map: MapComponent, host: FeatureComponent) {
    super(map, host);
  }

  ngOnInit() {
    this.setInstance(new Point(this.coordinates(), this.layout()));
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { coordinates } = changes;

    if (coordinates && this.instance) {
      this.instance.setCoordinates(coordinates.currentValue);
    }
  }
}
