import { Component, OnChanges, OnInit, SimpleChanges, inject, input } from '@angular/core';
import { MapComponent } from './map.component';
import { GeometryLinestringComponent } from './geom/geometrylinestring.component';
import { GeometryPolygonComponent } from './geom/geometrypolygon.component';
import { GeometryMultiPointComponent } from './geom/geometrymultipoint.component';
import { GeometryMultiLinestringComponent } from './geom/geometrymultilinestring.component';
import { GeometryMultiPolygonComponent } from './geom/geometrymultipolygon.component';
import { Coordinate } from 'ol/coordinate';
import { transform } from 'ol/proj';
import { ObjectEvent } from 'ol/Object';

@Component({
  selector: 'aol-collection-coordinates',
  template: ` <div class="aol-collection-coordinates"></div> `,
})
export class CollectionCoordinatesComponent implements OnChanges, OnInit {
  readonly coordinates = input.required<
    Coordinate[] | Coordinate[][] | Coordinate[][][] | Array<number>
  >();
  readonly srid = input('EPSG:3857');

  private readonly host: any;
  private readonly map = inject(MapComponent);
  private readonly geometryLinestring = inject(GeometryLinestringComponent, { optional: true });
  private readonly geometryPolygon = inject(GeometryPolygonComponent, { optional: true });
  private readonly geometryMultipoint = inject(GeometryMultiPointComponent, { optional: true });
  private readonly geometryMultilinestring = inject(GeometryMultiLinestringComponent, {
    optional: true,
  });
  private readonly geometryMultipolygon = inject(GeometryMultiPolygonComponent, {
    optional: true,
  });
  private mapSrid = 'EPSG:3857';

  constructor() {
    if (!!this.geometryLinestring) {
      this.host = this.geometryLinestring;
    } else if (!!this.geometryPolygon) {
      this.host = this.geometryPolygon;
    } else if (!!this.geometryMultipoint) {
      this.host = this.geometryMultipoint;
    } else if (!!this.geometryMultilinestring) {
      this.host = this.geometryMultilinestring;
    } else if (!!this.geometryMultipolygon) {
      this.host = this.geometryMultipolygon;
    } else {
      throw new Error('aol-collection-coordinates must be a child of a geometry component');
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
    let transformedCoordinates: Coordinate[] | Coordinate[][] | Coordinate[][][] | Array<number> =
      [];

    if (this.srid() === this.mapSrid) {
      transformedCoordinates = this.coordinates();
    } else {
      switch (this.host.componentType) {
        case 'geometry-linestring':
        case 'geometry-multipoint':
          transformedCoordinates = (this.coordinates() as Coordinate[]).map((c) =>
            transform(c, this.srid(), this.mapSrid),
          );
          break;
        case 'geometry-polygon':
        case 'geometry-multilinestring':
          transformedCoordinates = (this.coordinates() as Coordinate[][]).map((cc) =>
            cc.map((c) => transform(c, this.srid(), this.mapSrid)),
          );
          break;
        case 'geometry-multipolygon':
          transformedCoordinates = (this.coordinates() as Coordinate[][][]).map((ccc) =>
            ccc.map((cc) => cc.map((c) => transform(c, this.srid(), this.mapSrid))),
          );
          break;
      }
    }

    this.host.instance.setCoordinates(transformedCoordinates);
  }
}
