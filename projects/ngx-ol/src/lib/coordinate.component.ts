import { Component, OnChanges, SimpleChanges, OnInit, inject, input } from '@angular/core';
import { transform } from 'ol/proj';
import { MapComponent } from './map.component';
import { GeometryPointComponent } from './geom/geometrypoint.component';
import { GeometryCircleComponent } from './geom/geometrycircle.component';
import { ViewComponent } from './view.component';
import { OverlayComponent } from './overlay.component';
import { ObjectEvent } from 'ol/Object';

@Component({
  selector: 'aol-coordinate',
  template: ` <div class="aol-coordinate"></div> `,
})
export class CoordinateComponent implements OnChanges, OnInit {
  x = input.required<number>();
  y = input.required<number>();
  srid = input('EPSG:3857');

  private host: any;
  private readonly map = inject(MapComponent);
  private readonly viewHost = inject(ViewComponent, { optional: true });
  private readonly geometryPointHost = inject(GeometryPointComponent, { optional: true });
  private readonly geometryCircleHost = inject(GeometryCircleComponent, { optional: true });
  private readonly overlayHost = inject(OverlayComponent, { optional: true });
  private mapSrid = 'EPSG:3857';

  constructor() {
    // console.log('instancing aol-coordinate');
    if (this.geometryPointHost !== null) {
      this.host = this.geometryPointHost;
    } else if (this.geometryCircleHost !== null) {
      this.host = this.geometryCircleHost;
    } else if (this.viewHost !== null) {
      this.host = this.viewHost;
    } else if (this.overlayHost !== null) {
      this.host = this.overlayHost;
    }
  }

  ngOnInit() {
    this.map.instance.on('change:view', (e) => this.onMapViewChanged(e));
    this.mapSrid = this.map.instance.getView().getProjection().getCode();
    this.transformCoordinates();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.transformCoordinates();
  }

  private onMapViewChanged(event: ObjectEvent) {
    this.mapSrid = event.target.get(event.key).getProjection().getCode();
    this.transformCoordinates();
  }

  private transformCoordinates() {
    let transformedCoordinates: number[];

    if (this.srid() === this.mapSrid) {
      transformedCoordinates = [this.x(), this.y()];
    } else {
      transformedCoordinates = transform([this.x(), this.y()], this.srid(), this.mapSrid);
    }

    switch (this.host.componentType) {
      case 'geometry-point':
        this.host.instance.setCoordinates(transformedCoordinates);
        break;
      case 'geometry-circle':
      case 'view':
        this.host.instance.setCenter(transformedCoordinates);
        break;
      case 'overlay':
        this.host.instance.setPosition(transformedCoordinates);
        break;
    }
  }
}
