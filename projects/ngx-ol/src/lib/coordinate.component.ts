import { Component, DoCheck, Optional, OnChanges, SimpleChanges, OnInit, input } from '@angular/core';
import { transform } from 'ol/proj';
import { MapComponent } from './map.component';
import { GeometryPointComponent } from './geom/geometrypoint.component';
import { GeometryCircleComponent } from './geom/geometrycircle.component';
import { SimpleGeometryComponent } from './geom/simplegeometry.component';
import { ViewComponent } from './view.component';
import { OverlayComponent } from './overlay.component';
import { ObjectEvent } from 'ol/Object';

@Component({
  selector: 'aol-coordinate',
  template: ` <div class="aol-coordinate"></div> `,
})
export class CoordinateComponent implements DoCheck, OnChanges, OnInit {
  x = input.required<number>();
  y = input.required<number>();
  srid = input<string | undefined>();
  private host: any;
  private geometryHost?: SimpleGeometryComponent;
  private mapSrid = 'EPSG:3857';
  private currentSrid = 'EPSG:3857';

  constructor(
    private map: MapComponent,
    @Optional() viewHost: ViewComponent,
    @Optional() geometryPointHost: GeometryPointComponent,
    @Optional() geometryCircleHost: GeometryCircleComponent,
    @Optional() overlayHost: OverlayComponent,
  ) {
    // console.log('instancing aol-coordinate');
    if (geometryPointHost !== null) {
      this.host = geometryPointHost;
      this.geometryHost = geometryPointHost;
    } else if (geometryCircleHost !== null) {
      this.host = geometryCircleHost;
      this.geometryHost = geometryCircleHost;
    } else if (viewHost !== null) {
      this.host = viewHost;
    } else if (overlayHost !== null) {
      this.host = overlayHost;
    }
  }

  ngOnInit() {
    this.map.instance.on('change:view', (e) => this.onMapViewChanged(e));
    this.mapSrid = this.map.instance.getView().getProjection().getCode();
    this.currentSrid = this.getSrid();
    this.transformCoordinates();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.transformCoordinates();
  }

  ngDoCheck() {
    const srid = this.getSrid();

    if (srid !== this.currentSrid) {
      this.currentSrid = srid;
      this.transformCoordinates();
    }
  }

  private onMapViewChanged(event: ObjectEvent) {
    this.mapSrid = event.target.get(event.key).getProjection().getCode();
    this.transformCoordinates();
  }

  private transformCoordinates() {
    let transformedCoordinates: number[];
    const srid = this.getSrid();

    if (srid === this.mapSrid) {
      transformedCoordinates = [this.x(), this.y()];
    } else {
      transformedCoordinates = transform([this.x(), this.y()], srid, this.mapSrid);
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

  private getSrid(): string {
    return this.srid() ?? this.geometryHost?.srid() ?? 'EPSG:3857';
  }
}
