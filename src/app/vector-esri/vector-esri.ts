import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import { type FeatureLike } from 'ol/Feature';
import EsriJSON from 'ol/format/EsriJSON';
import type { MapBrowserEvent } from 'ol';
import { unByKey } from 'ol/Observable';
import { transform } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style, { type StyleLike } from 'ol/style/Style';
import { createXYZ } from 'ol/tilegrid';
import { tile as tileStrategy } from 'ol/loadingstrategy';
import type { Coordinate } from 'ol/coordinate';
import type { Extent } from 'ol/extent';

@Component({
  selector: 'app-vector-esri',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './vector-esri.html',
  styleUrl: './vector-esri.less',
})
export class VectorEsri {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fillColors: Record<string, [number, number, number, number]> = {
    'Lost To Sea Since 1965': [0, 0, 0, 1],
    'Urban/Built-up': [104, 104, 104, 1],
    Shacks: [115, 76, 0, 1],
    Industry: [230, 0, 0, 1],
    Wasteland: [230, 0, 0, 1],
    Caravans: [0, 112, 255, 0.5],
    Defence: [230, 152, 0, 0.5],
    Transport: [230, 152, 0, 1],
    'Open Countryside': [255, 255, 115, 1],
    Woodland: [38, 115, 0, 1],
    'Managed Recreation/Sport': [85, 255, 0, 1],
    'Amenity Water': [0, 112, 255, 1],
    'Inland Water': [0, 38, 115, 1],
  };
  private readonly sharedStyle = new Style({
    fill: new Fill(),
    stroke: new Stroke({
      color: [0, 0, 0, 1],
      width: 0.5,
    }),
  });

  readonly center = signal<Coordinate>(transform([1.72, 52.4], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(14);
  readonly serviceUrl = signal(
    'https://services-eu1.arcgis.com/NPIbx47lsIiu2pqz/ArcGIS/rest/services/',
  );
  readonly serviceLayer = signal('Neptune_Coastline_Campaign_Open_Data_Land_Use_2014/FeatureServer/0');
  readonly baseSource = signal(
    new XYZ({
      attributions:
        'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    }),
  );
  readonly vectorSource = signal(this.createVectorSource());
  readonly vectorStyle = signal<StyleLike>((feature) => this.getVectorStyle(feature));
  readonly vectorOpacity = signal(0.7);
  readonly isLoading = signal(false);
  readonly loadedFeatureCount = signal(0);
  readonly infoTitle = signal('Hover or click a feature');
  readonly infoLine1 = signal('2014 Land Use: -');
  readonly infoLine2 = signal('1965 Land Use: -');

  constructor() {
    const source = this.vectorSource();
    const subscriptions = [
      source.on('featuresloadstart', () => this.isLoading.set(true)),
      source.on('featuresloadend', () => {
        this.isLoading.set(false);
        this.loadedFeatureCount.set(source.getFeatures().length);
      }),
      source.on('featuresloaderror', () => this.isLoading.set(false)),
      source.on('change', () => this.loadedFeatureCount.set(source.getFeatures().length)),
    ];

    this.destroyRef.onDestroy(() => unByKey(subscriptions));
  }

  protected updateFeatureInfo(event: MapBrowserEvent<MouseEvent>): void {
    if (event.dragging) {
      return;
    }

    const feature = event.map.forEachFeatureAtPixel(event.pixel, (candidate) => candidate);

    if (!feature) {
      this.infoTitle.set('Hover or click a feature');
      this.infoLine1.set('2014 Land Use: -');
      this.infoLine2.set('1965 Land Use: -');
      event.map.getTargetElement().style.cursor = '';
      return;
    }

    this.infoTitle.set('Land use details');
    this.infoLine1.set(`2014 Land Use: ${String(feature.get('LU_2014') ?? 'Unknown')}`);
    this.infoLine2.set(`1965 Land Use: ${String(feature.get('LU_1965') ?? 'Unknown')}`);
    event.map.getTargetElement().style.cursor = 'pointer';
  }

  private createVectorSource(): VectorSource {
    return new VectorSource({
      attributions:
        'University of Leicester (commissioned by the <a href="https://www.arcgis.com/home/item.html?id=d5f05b1dc3dd4d76906c421bc1727805">National Trust</a>)',
      format: new EsriJSON(),
      strategy: tileStrategy(
        createXYZ({
          tileSize: 512,
        }),
      ),
      url: (extent, _resolution, projection) => {
        const srid = projection.getCode().split(/:(?=\d+$)/).pop() ?? '3857';
        return this.buildQueryUrl(extent, srid);
      },
    });
  }

  private buildQueryUrl(extent: Extent, srid: string): string {
    const params = new URLSearchParams({
      f: 'json',
      returnGeometry: 'true',
      spatialRel: 'esriSpatialRelIntersects',
      geometry: JSON.stringify({
        xmin: extent[0],
        ymin: extent[1],
        xmax: extent[2],
        ymax: extent[3],
        spatialReference: { wkid: Number(srid) },
      }),
      geometryType: 'esriGeometryEnvelope',
      inSR: srid,
      outFields: '*',
      outSR: srid,
    });

    return `${this.serviceUrl()}${this.serviceLayer()}/query/?${params.toString()}`;
  }

  private getVectorStyle(feature: FeatureLike): Style {
    const classify = String(feature.get('LU_2014') ?? '');
    this.sharedStyle.getFill()?.setColor(this.fillColors[classify] ?? [0, 0, 0, 0]);
    return this.sharedStyle;
  }
}
