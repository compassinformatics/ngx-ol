import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate.js';
import type { Extent } from 'ol/extent.js';
import { unByKey } from 'ol/Observable.js';
import OSM from 'ol/source/OSM.js';
import TileArcGISRest from 'ol/source/TileArcGISRest.js';

@Component({
  selector: 'app-arcgis-tiled',
  imports: [AngularOpenlayersModule],
  templateUrl: './arcgis-tiled.html',
  styleUrl: './arcgis-tiled.less',
})
export class ArcgisTiled {
  private readonly destroyRef = inject(DestroyRef);

  readonly center = signal<Coordinate>([-10997148, 4569099]);
  readonly zoom = signal(4);
  readonly serviceUrl = signal(
    'https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/USA/MapServer',
  );
  readonly serviceExtent = signal<Extent>([-13884991, 2870341, -7455066, 6338219]);
  readonly osmSource = signal(new OSM());
  readonly arcgisSource = signal(
    new TileArcGISRest({
      url: this.serviceUrl(),
    }),
  );
  readonly isLoading = signal(false);
  readonly lastLoadedAt = signal('Not loaded yet');
  readonly lastErrorAt = signal('None');

  constructor() {
    const source = this.arcgisSource();
    const subscriptions = [
      source.on('tileloadstart', () => this.isLoading.set(true)),
      source.on('tileloadend', () => {
        this.isLoading.set(false);
        this.lastLoadedAt.set(new Date().toLocaleTimeString());
      }),
      source.on('tileloaderror', () => {
        this.isLoading.set(false);
        this.lastErrorAt.set(new Date().toLocaleTimeString());
      }),
    ];

    this.destroyRef.onDestroy(() => unByKey(subscriptions));
  }
}
