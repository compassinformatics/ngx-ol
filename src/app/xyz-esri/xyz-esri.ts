import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate';
import { unByKey } from 'ol/Observable';
import { transform } from 'ol/proj';
import XYZ from 'ol/source/XYZ';

@Component({
  selector: 'app-xyz-esri',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './xyz-esri.html',
  styleUrl: './xyz-esri.less',
})
export class XyzEsri {
  private readonly destroyRef = inject(DestroyRef);

  readonly center = signal<Coordinate>(transform([-121.1, 47.5], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(7);
  readonly serviceUrl = signal(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
  );
  readonly xyzSource = signal(
    new XYZ({
      attributions:
        'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
      url: this.serviceUrl(),
    }),
  );
  readonly isLoading = signal(false);
  readonly lastLoadedAt = signal('Not loaded yet');
  readonly lastErrorAt = signal('None');

  constructor() {
    const source = this.xyzSource();
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
