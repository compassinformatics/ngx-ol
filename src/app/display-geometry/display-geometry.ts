import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AngularOpenlayersModule } from 'ngx-ol';
import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';
import GeoJSON, { GeoJSONFeatureCollection } from 'ol/format/GeoJSON';
import { Point } from 'ol/geom';
import { transform } from 'ol/proj';
import { map } from 'rxjs';

@Component({
  selector: 'app-display-geometry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './display-geometry.html',
  styleUrl: './display-geometry.less',
})
export class DisplayGeometry {
  readonly center = signal<Coordinate>(transform([1, 46.292896], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(6);

  private readonly http = inject(HttpClient);
  private readonly geoJson = new GeoJSON();
  readonly features = toSignal(
    this.http.get<GeoJSONFeatureCollection>('/features.json').pipe(
      map((payload) =>
        this.geoJson.readFeatures(payload, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        }),
      ),
    ),
    { initialValue: [] },
  );

  readonly dynamicFeature = signal(
    new Feature({
      geometry: new Point(transform([-0.649, 44.026], 'EPSG:4326', 'EPSG:3857')),
    }),
  );

  protected moveFeature(): void {
    this.dynamicFeature.set(
      new Feature({
        geometry: new Point(transform([3.922, 44.34], 'EPSG:4326', 'EPSG:3857')),
      }),
    );
  }
}
