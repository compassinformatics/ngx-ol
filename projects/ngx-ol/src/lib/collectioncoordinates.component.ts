import { Component, DoCheck, OnChanges, OnInit, Optional, SimpleChanges, input } from '@angular/core';
import { MapComponent } from './map.component';
import { GeometryLinestringComponent } from './geom/geometrylinestring.component';
import { GeometryPolygonComponent } from './geom/geometrypolygon.component';
import { GeometryMultiPointComponent } from './geom/geometrymultipoint.component';
import { GeometryMultiLinestringComponent } from './geom/geometrymultilinestring.component';
import { GeometryMultiPolygonComponent } from './geom/geometrymultipolygon.component';
import { SimpleGeometryComponent } from './geom/simplegeometry.component';
import { Coordinate } from 'ol/coordinate';
import { transform } from 'ol/proj';
import { ObjectEvent } from 'ol/Object';

@Component({
  selector: 'aol-collection-coordinates',
  template: ` <div class="aol-collection-coordinates"></div> `,
})
export class CollectionCoordinatesComponent implements DoCheck, OnChanges, OnInit {
  readonly coordinates = input.required<Coordinate[] | Coordinate[][] | Coordinate[][][] | Array<number>>();
  readonly srid = input<string | undefined>();
  private host: SimpleGeometryComponent;
  private mapSrid = 'EPSG:3857';
  private currentSrid = 'EPSG:3857';

  constructor(
    private readonly map: MapComponent,
    @Optional() geometryLinestring: GeometryLinestringComponent,
    @Optional() geometryPolygon: GeometryPolygonComponent,
    @Optional() geometryMultipoint: GeometryMultiPointComponent,
    @Optional() geometryMultilinestring: GeometryMultiLinestringComponent,
    @Optional() geometryMultipolygon: GeometryMultiPolygonComponent,
  ) {
    if (!!geometryLinestring) {
      this.host = geometryLinestring;
    } else if (!!geometryPolygon) {
      this.host = geometryPolygon;
    } else if (!!geometryMultipoint) {
      this.host = geometryMultipoint;
    } else if (!!geometryMultilinestring) {
      this.host = geometryMultilinestring;
    } else if (!!geometryMultipolygon) {
      this.host = geometryMultipolygon;
    } else {
      throw new Error('aol-collection-coordinates must be a child of a geometry component');
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
    let transformedCoordinates: Coordinate[] | Coordinate[][] | Coordinate[][][] | Array<number> =
      [];
    const srid = this.getSrid();

    if (srid === this.mapSrid) {
      transformedCoordinates = this.coordinates();
    } else {
      switch (this.host.componentType) {
        case 'geometry-linestring':
        case 'geometry-multipoint':
          transformedCoordinates = (this.coordinates() as Coordinate[]).map((c) =>
            transform(c, srid, this.mapSrid),
          );
          break;
        case 'geometry-polygon':
        case 'geometry-multilinestring':
          transformedCoordinates = (this.coordinates() as Coordinate[][]).map((cc) =>
            cc.map((c) => transform(c, srid, this.mapSrid)),
          );
          break;
        case 'geometry-multipolygon':
          transformedCoordinates = (this.coordinates() as Coordinate[][][]).map((ccc) =>
            ccc.map((cc) => cc.map((c) => transform(c, srid, this.mapSrid))),
          );
          break;
      }
    }

    this.host.instance.setCoordinates(transformedCoordinates);
  }

  private getSrid(): string {
    return this.srid() ?? this.host.srid() ?? 'EPSG:3857';
  }
}
