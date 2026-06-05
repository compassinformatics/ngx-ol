import { Component, computed, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import Feature from 'ol/Feature';
import type { Coordinate } from 'ol/coordinate';
import type { Extent } from 'ol/extent';
import Point from 'ol/geom/Point';
import { transform } from 'ol/proj';

const POINTS: readonly [number, number, number][] = [
  [-5.9, 53.3, 0.4],
  [-4.2, 54.6, 0.7],
  [-2.1, 53.9, 0.9],
  [-1.2, 55.4, 0.6],
  [-6.7, 55.1, 1],
  [-3.4, 52.7, 0.5],
];

@Component({
  selector: 'app-reactive-view-layers',
  imports: [AngularOpenlayersModule],
  templateUrl: './reactive-view-layers.html',
  styleUrl: './reactive-view-layers.less',
})
export class ReactiveViewLayers {
  readonly center = signal<Coordinate>(transform([-3.8, 54.3], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(6);
  readonly rotation = signal(0);
  readonly minZoom = signal(3);
  readonly maxZoom = signal(12);
  readonly layerOpacity = signal(0.85);
  readonly layerVisible = signal(true);
  readonly layerZIndex = signal(2);
  readonly layerMinZoom = signal(3);
  readonly layerMaxZoom = signal(13);
  readonly layerExtentEnabled = signal(false);
  readonly heatmapBlur = signal(18);
  readonly heatmapRadius = signal(12);
  readonly heatmapOpacity = signal(0.75);
  readonly heatmapVisible = signal(true);

  readonly layerExtent = computed<Extent | undefined>(() =>
    this.layerExtentEnabled() ? transformExtent([-8, 52, 0, 56.4]) : undefined,
  );
  readonly features = computed(() =>
    POINTS.map(([longitude, latitude, weight]) => {
      const feature = new Feature({
        geometry: new Point(transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857')),
      });

      feature.set('weight', weight);
      return feature;
    }),
  );

  protected setZoom(zoom: number): void {
    this.zoom.set(zoom);
  }

  protected setRotation(rotation: number): void {
    this.rotation.set(rotation);
  }

  protected setMinZoom(minZoom: number): void {
    this.minZoom.set(minZoom);
  }

  protected setMaxZoom(maxZoom: number): void {
    this.maxZoom.set(maxZoom);
  }

  protected setLayerOpacity(opacity: number): void {
    this.layerOpacity.set(opacity);
  }

  protected setLayerVisible(visible: boolean): void {
    this.layerVisible.set(visible);
  }

  protected setLayerZIndex(zIndex: number): void {
    this.layerZIndex.set(zIndex);
  }

  protected setLayerMinZoom(minZoom: number): void {
    this.layerMinZoom.set(minZoom);
  }

  protected setLayerMaxZoom(maxZoom: number): void {
    this.layerMaxZoom.set(maxZoom);
  }

  protected toggleLayerExtent(): void {
    this.layerExtentEnabled.update((enabled) => !enabled);
  }

  protected setHeatmapBlur(blur: number): void {
    this.heatmapBlur.set(blur);
  }

  protected setHeatmapRadius(radius: number): void {
    this.heatmapRadius.set(radius);
  }

  protected setHeatmapOpacity(opacity: number): void {
    this.heatmapOpacity.set(opacity);
  }

  protected setHeatmapVisible(visible: boolean): void {
    this.heatmapVisible.set(visible);
  }
}

function transformExtent(extent: Extent): Extent {
  const bottomLeft = transform([extent[0], extent[1]], 'EPSG:4326', 'EPSG:3857');
  const topRight = transform([extent[2], extent[3]], 'EPSG:4326', 'EPSG:3857');

  return [bottomLeft[0], bottomLeft[1], topRight[0], topRight[1]];
}
