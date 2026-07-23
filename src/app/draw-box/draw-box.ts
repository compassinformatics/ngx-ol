import { JsonPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import Feature from 'ol/Feature.js';
import { Coordinate } from 'ol/coordinate.js';
import GeoJSON, { GeoJSONFeature } from 'ol/format/GeoJSON.js';
import { createBox } from 'ol/interaction/Draw.js';
import Polygon from 'ol/geom/Polygon.js';
import { transform } from 'ol/proj.js';
import { AngularOpenlayersModule } from 'ngx-ol';

@Component({
  selector: 'app-draw-box',
  imports: [AngularOpenlayersModule, JsonPipe],
  templateUrl: './draw-box.html',
  styleUrl: './draw-box.less',
})
export class DrawBox {
  readonly center = signal<Coordinate>(transform([1.4886, 43.5554], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(5);
  readonly isDrawing = signal(false);
  readonly drawBoxGeometryFunction = createBox();
  readonly feature = signal<Feature<Polygon> | null>(null);
  readonly featureResult = computed<GeoJSONFeature | null>(() => {
    const feature = this.feature();

    if (!feature) {
      return null;
    }

    return this.geoJson.writeFeatureObject(feature, {
      featureProjection: 'EPSG:3857',
      dataProjection: 'EPSG:4326',
    });
  });

  private readonly geoJson = new GeoJSON();

  protected toggleDrawMode(): void {
    this.isDrawing.update((isDrawing) => !isDrawing);
  }

  protected endDraw(feature: Feature): void {
    const geometry = feature.getGeometry();

    if (geometry instanceof Polygon) {
      this.feature.set(
        new Feature({
          geometry: geometry.clone(),
        }),
      );
    }

    this.isDrawing.set(false);
  }
}
