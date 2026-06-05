import { Component, computed, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import Feature from 'ol/Feature';
import type { Coordinate } from 'ol/coordinate';
import type { Extent } from 'ol/extent';
import Point from 'ol/geom/Point';
import { transform } from 'ol/proj';

type SourceKind =
  | 'tile-wms'
  | 'vector'
  | 'image-wms'
  | 'image-arcgis'
  | 'tile-arcgis'
  | 'tile-json'
  | 'wmts';
type LocalWmsLayer = 'topp:states' | 'ne:ne';
type EpaWmsLayer = 'EPA:ADMIN_County' | 'EPA:WFD_Catchments';
type ArcgisLayer = '0' | '2' | '3';

const FEATURE_COORDINATES: readonly [number, number][] = [
  [-122.4194, 37.7749],
  [-118.2437, 34.0522],
  [-112.074, 33.4484],
  [-104.9903, 39.7392],
  [-96.797, 32.7767],
  [-87.6298, 41.8781],
];

const SOURCE_VIEWS: Record<SourceKind, { center: Coordinate; zoom: number }> = {
  'tile-wms': {
    center: transform([-99, 39], 'EPSG:4326', 'EPSG:3857'),
    zoom: 4,
  },
  vector: {
    center: transform([-99, 39], 'EPSG:4326', 'EPSG:3857'),
    zoom: 4,
  },
  'image-wms': {
    center: transform([-4.8, 53.4], 'EPSG:4326', 'EPSG:3857'),
    zoom: 6,
  },
  'image-arcgis': {
    center: transform([-98, 39], 'EPSG:4326', 'EPSG:3857'),
    zoom: 4,
  },
  'tile-arcgis': {
    center: transform([-98, 39], 'EPSG:4326', 'EPSG:3857'),
    zoom: 4,
  },
  'tile-json': {
    center: transform([-2.269282, 46.987247], 'EPSG:4326', 'EPSG:3857'),
    zoom: 3,
  },
  wmts: {
    center: transform([-5.3, 51.7], 'EPSG:4326', 'EPSG:3857'),
    zoom: 5.75,
  },
};

@Component({
  selector: 'app-reactive-sources',
  imports: [AngularOpenlayersModule],
  templateUrl: './reactive-sources.html',
  styleUrl: './reactive-sources.less',
})
export class ReactiveSources {
  readonly center = signal<Coordinate>(SOURCE_VIEWS['tile-wms'].center);
  readonly zoom = signal(SOURCE_VIEWS['tile-wms'].zoom);
  readonly sourceKind = signal<SourceKind>('tile-wms');
  readonly localWmsLayer = signal<LocalWmsLayer>('topp:states');
  readonly epaWmsLayer = signal<EpaWmsLayer>('EPA:ADMIN_County');
  readonly wmsRatio = signal(1);
  readonly arcgisLayer = signal<ArcgisLayer>('2');
  readonly arcgisHidpi = signal(true);
  readonly tileJsonUrl = 'tile-json/carto-light.json';
  readonly wmtsTime = signal('2024-01-01');
  readonly wmtsUrl = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi';
  readonly featureCount = signal(3);
  readonly sourceStatus = signal(
    'Tile WMS source selected. Change params and watch the map update.',
  );
  readonly imageExtent = signal<Extent>([-1250000, 6250000, 500000, 7600000]);
  readonly localWmsParams = computed(() => ({
    FORMAT: 'image/png',
    LAYERS: this.localWmsLayer(),
    TRANSPARENT: true,
  }));
  readonly epaWmsParams = computed(() => ({ LAYERS: this.epaWmsLayer() }));
  readonly arcgisParams = computed(() => ({ LAYERS: `show:${this.arcgisLayer()}` }));
  readonly wmtsDimensions = computed(() => ({ TIME: this.wmtsTime() }));
  readonly features = computed(() =>
    FEATURE_COORDINATES.slice(0, this.featureCount()).map(
      (coordinate, index) =>
        new Feature({
          geometry: new Point(transform(coordinate, 'EPSG:4326', 'EPSG:3857')),
          name: `Reactive point ${index + 1}`,
        }),
    ),
  );
  readonly wmtsMatrixIds = Array.from({ length: 10 }, (_, index) => index.toString());
  readonly wmtsResolutions = [
    156543.03392804097, 78271.51696402048, 39135.75848201024, 19567.87924100512, 9783.93962050256,
    4891.96981025128, 2445.98490512564, 1222.99245256282, 611.49622628141, 305.748113140705,
  ];

  protected setSourceKind(sourceKind: SourceKind): void {
    this.sourceKind.set(sourceKind);
    this.setView(sourceKind);
    this.sourceStatus.set(this.getSourceStatus(sourceKind));
  }

  protected resetView(): void {
    this.setView(this.sourceKind());
  }

  protected setLocalWmsLayer(layer: LocalWmsLayer): void {
    this.localWmsLayer.set(layer);
    this.sourceStatus.set(`Tile WMS params changed to ${layer}.`);
  }

  protected setEpaWmsLayer(layer: EpaWmsLayer): void {
    this.epaWmsLayer.set(layer);
    this.sourceStatus.set(`Image WMS params changed to ${layer}.`);
  }

  protected setWmsRatio(ratio: number): void {
    this.wmsRatio.set(ratio);
    this.sourceStatus.set(`Image WMS ratio changed to ${ratio}.`);
  }

  protected setFeatureCount(count: number): void {
    this.featureCount.set(count);
    this.sourceStatus.set(`Vector source now has ${count} features.`);
  }

  protected setArcgisLayer(layer: ArcgisLayer): void {
    this.arcgisLayer.set(layer);
    this.sourceStatus.set(`ArcGIS layer params changed to show:${layer}.`);
  }

  protected toggleArcgisHidpi(): void {
    this.arcgisHidpi.update((hidpi) => !hidpi);
    this.sourceStatus.set(`ArcGIS HiDPI rendering ${this.arcgisHidpi() ? 'enabled' : 'disabled'}.`);
  }

  protected setWmtsTime(time: string): void {
    this.wmtsTime.set(time);
    this.sourceStatus.set(`WMTS TIME dimension changed to ${time}.`);
  }

  protected imageLoadStart(): void {
    this.sourceStatus.set('Loading image...');
  }

  protected imageLoadEnd(): void {
    this.sourceStatus.set(`Image loaded at ${new Date().toLocaleTimeString()}`);
  }

  protected imageLoadError(): void {
    this.sourceStatus.set(`Image load error at ${new Date().toLocaleTimeString()}`);
  }

  protected tileLoadStart(): void {
    this.sourceStatus.set('Loading tiles...');
  }

  protected tileLoadEnd(): void {
    this.sourceStatus.set(`Tiles loaded at ${new Date().toLocaleTimeString()}`);
  }

  protected tileLoadError(): void {
    this.sourceStatus.set(`Tile load error at ${new Date().toLocaleTimeString()}`);
  }

  private setView(sourceKind: SourceKind): void {
    const view = SOURCE_VIEWS[sourceKind];

    this.center.set(view.center);
    this.zoom.set(view.zoom);
  }

  private getSourceStatus(sourceKind: SourceKind): string {
    switch (sourceKind) {
      case 'tile-wms':
        return 'Tile WMS source selected. Change params and watch the map update.';
      case 'vector':
        return `Vector source selected with ${this.featureCount()} features.`;
      case 'image-wms':
        return 'Image WMS source selected. Image load events will update this status.';
      case 'image-arcgis':
        return 'Image ArcGIS REST source selected. Image load events will update this status.';
      case 'tile-arcgis':
        return 'Tile ArcGIS REST source selected. Change params and watch the map update.';
      case 'tile-json':
        return `TileJSON source selected: ${this.tileJsonUrl}`;
      case 'wmts':
        return 'WMTS source selected. Tile load events will update this status.';
    }
  }
}
