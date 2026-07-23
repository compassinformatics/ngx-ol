import { Component, computed, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import type { Coordinate } from 'ol/coordinate.js';
import { transform } from 'ol/proj.js';

@Component({
  selector: 'app-marker',
  imports: [AngularOpenlayersModule],
  templateUrl: './marker.html',
  styleUrl: './marker.less',
})
export class Marker {
  readonly center = signal<Coordinate>(transform([-2.269282, 46.987247], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(12);
  readonly marker = signal<Coordinate>(transform([-2.264184, 46.996207], 'EPSG:4326', 'EPSG:3857'));
  readonly markerFeature = computed(
    () =>
      new Feature({
        geometry: new Point(this.marker()),
      }),
  );
}
