import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import Feature from 'ol/Feature';
import GeoJSON, { GeoJSONFeature } from 'ol/format/GeoJSON';
import Polygon from 'ol/geom/Polygon';
import type { Coordinate } from 'ol/coordinate';
import Projection from 'ol/proj/Projection';
import { transform } from 'ol/proj';

@Component({
  selector: 'app-modify-polygon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule, JsonPipe],
  templateUrl: './modify-polygon.html',
  styleUrl: './modify-polygon.less',
})
export class ModifyPolygon {
  private readonly format = new GeoJSON();
  private readonly displayProjection = new Projection({ code: 'EPSG:3857' });
  private readonly dataProjection = new Projection({ code: 'EPSG:4326' });
  private readonly polygonFeature = new Feature({
    geometry: new Polygon([
      [
        transform([-1.7138671875, 43.35713822211053], 'EPSG:4326', 'EPSG:3857'),
        transform([4.515380859375, 43.35713822211053], 'EPSG:4326', 'EPSG:3857'),
        transform([4.515380859375, 47.76886840424207], 'EPSG:4326', 'EPSG:3857'),
        transform([-1.7138671875, 47.76886840424207], 'EPSG:4326', 'EPSG:3857'),
        transform([-1.7138671875, 43.35713822211053], 'EPSG:4326', 'EPSG:3857'),
      ],
    ]),
  });

  readonly center = signal<Coordinate>(transform([1.4886, 43.5554], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(5);
  readonly featureResult = signal(
    this.format.writeFeatureObject(this.polygonFeature, {
      dataProjection: this.dataProjection,
      featureProjection: this.displayProjection,
    }) as GeoJSONFeature,
  );

  protected modifyEnd(feature: Feature): void {
    const geometry = feature.getGeometry();

    if (geometry instanceof Polygon) {
      this.featureResult.set(
        this.format.writeFeatureObject(feature, {
          dataProjection: this.dataProjection,
          featureProjection: this.displayProjection,
        }) as GeoJSONFeature,
      );
    }
  }

  protected readonly feature = this.polygonFeature;
}
