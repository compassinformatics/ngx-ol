import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FeatureComponent } from '../feature.component';
import { Circle } from 'ol/geom';
import { SimpleGeometryComponent } from './simplegeometry.component';
import { MapComponent } from '../map.component';
import { Coordinate } from 'ol/coordinate';
import { GeometryLayout } from 'ol/geom/Geometry';

@Component({
  selector: 'aol-geometry-circle',
  template: ` <ng-content></ng-content> `,
})
export class GeometryCircleComponent extends SimpleGeometryComponent implements OnInit, OnChanges {
  @Input() center: Coordinate = [0, 0];
  @Input() layout: GeometryLayout;
  @Input() radius: number;

  public componentType = 'geometry-circle';
  public instance: Circle;

  constructor(map: MapComponent, host: FeatureComponent) {
    super(map, host);
  }

  ngOnInit() {
    this.instance = new Circle(this.center, this.radius, this.layout);
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { center, radius } = changes;

    if (center && this.instance) {
      this.instance.setCenter(center.currentValue);
    }

    if (radius && this.instance) {
      this.instance.setRadius(radius.currentValue);
    }
  }
}
