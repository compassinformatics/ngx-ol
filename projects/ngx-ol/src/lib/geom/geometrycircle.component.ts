import { Component, OnChanges, OnInit, SimpleChanges, signal, input } from '@angular/core';
import { FeatureComponent } from '../feature.component';
import Circle from 'ol/geom/Circle';
import { SimpleGeometryComponent } from './simplegeometry.component';
import { MapComponent } from '../map.component';
import { Coordinate } from 'ol/coordinate';
import { GeometryLayout } from 'ol/geom/Geometry';

@Component({
  selector: 'aol-geometry-circle',
  template: ` <ng-content></ng-content> `,
})
export class GeometryCircleComponent extends SimpleGeometryComponent implements OnInit, OnChanges {
  readonly center = input<Coordinate>([0, 0]);
  readonly layout = input<GeometryLayout>();
  readonly radius = input<number>();
  readonly componentType: string = 'geometry-circle';
  instance: Circle;
  protected readonly _instanceSignal = signal<Circle | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Circle): Circle {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(map: MapComponent, host: FeatureComponent) {
    super(map, host);
  }

  ngOnInit() {
    this.setInstance(new Circle(this.center(), this.radius(), this.layout()));
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
