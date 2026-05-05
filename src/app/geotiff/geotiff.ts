import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, signal, viewChild } from '@angular/core';
import {
  AngularOpenlayersMapModule,
  AngularOpenlayersTileLayersModule,
} from 'ngx-ol';
import type { MapComponent } from 'ngx-ol';
import type { LayerWebGLTileComponent } from 'ngx-ol';
import type { Style } from 'ol/layer/WebGLTile';
import View from 'ol/View';
import GeoTIFFSource from 'ol/source/GeoTIFF';
import type { SourceInfo } from 'ol/source/GeoTIFF';

@Component({
  selector: 'app-geotiff',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersMapModule, AngularOpenlayersTileLayersModule],
  templateUrl: './geotiff.html',
  styleUrl: './geotiff.less',
})
export class Geotiff implements AfterViewInit, OnDestroy {
  private readonly map = viewChild.required<MapComponent>('map');
  private readonly geotiffLayer = viewChild.required<LayerWebGLTileComponent>('geotiffLayer');

  readonly isLoading = signal(true);
  readonly sourceUrl =
    'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif';
  readonly sources: SourceInfo[] = [
    {
      url: this.sourceUrl,
    },
  ];
  readonly style: Style = {
    exposure: 0.1,
    saturation: 0.2,
  };
  readonly source = new GeoTIFFSource({
    sources: this.sources,
  });

  ngAfterViewInit() {
    this.geotiffLayer().instance.setSource(this.source);
    this.source.getView().then((viewOptions) => {
      this.map().instance.setView(
        new View({
          ...viewOptions,
          showFullExtent: true,
        }),
      );
      this.isLoading.set(false);
    });
  }

  ngOnDestroy() {
    this.geotiffLayer().instance.setSource(null);
  }
}
