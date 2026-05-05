import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  AngularOpenlayersMapModule,
  AngularOpenlayersTileLayersModule,
  AngularOpenlayersVectorLayersModule,
} from 'ngx-ol';
import Geometry from 'ol/geom/Geometry';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import { fromLonLat } from 'ol/proj';

@Component({
  selector: 'app-geometry-collection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AngularOpenlayersMapModule,
    AngularOpenlayersTileLayersModule,
    AngularOpenlayersVectorLayersModule,
  ],
  templateUrl: './geometry-collection.html',
  styleUrl: './geometry-collection.less',
})
export class GeometryCollectionDemo {
  readonly center = signal(fromLonLat([-8.3, 53.15]));
  readonly zoom = signal(8);
  readonly geometries = signal<Geometry[]>([
    new Point(fromLonLat([-8.6267, 52.6647])),
    new LineString([
      fromLonLat([-9.2, 53.4]),
      fromLonLat([-8.5, 53.35]),
      fromLonLat([-7.8, 53.55]),
    ]),
    new Polygon([
      [
        fromLonLat([-8.95, 53.15]),
        fromLonLat([-8.35, 53.15]),
        fromLonLat([-8.35, 52.8]),
        fromLonLat([-8.95, 52.8]),
        fromLonLat([-8.95, 53.15]),
      ],
    ]),
  ]);
}
