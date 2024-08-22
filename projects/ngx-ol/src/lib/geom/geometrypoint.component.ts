import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FeatureComponent } from '../feature.component';
import { SimpleGeometryComponent } from './simplegeometry.component';
import { MapComponent } from '../map.component';
import { Point } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';
import { GeometryLayout } from 'ol/geom/Geometry';

@Component({
  selector: 'aol-geometry-point',
  template: ` <ng-content></ng-content> `,
})
export class GeometryPointComponent extends SimpleGeometryComponent implements OnInit, OnChanges {
  @Input() coordinates: Coordinate = [0, 0];
  @Input() layout: GeometryLayout;

  public componentType = 'geometry-point';
  public instance: Point;

  constructor(map: MapComponent, host: FeatureComponent) {
    super(map, host);
  }

  ngOnInit() {
    this.instance = new Point(this.coordinates, this.layout);
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { coordinates } = changes;

    if (coordinates && this.instance) {
      this.instance.setCoordinates(coordinates.currentValue);
    }
  }
}
