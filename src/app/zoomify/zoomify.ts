import { ChangeDetectionStrategy, Component, effect, signal, viewChild } from '@angular/core';
import {
  AngularOpenlayersMapModule,
  AngularOpenlayersTileLayersModule,
  MapComponent,
  SourceZoomifyComponent,
} from 'ngx-ol';
import type { Size } from 'ol/size';
import View from 'ol/View';

@Component({
  selector: 'app-zoomify',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersMapModule, AngularOpenlayersTileLayersModule],
  templateUrl: './zoomify.html',
  styleUrl: './zoomify.less',
})
export class ZoomifyDemo {
  private readonly map = viewChild<MapComponent>('map');
  private readonly source = viewChild<SourceZoomifyComponent>('zoomifySource');

  readonly imageSize: Size = [4000, 3000];
  readonly viewReady = signal(false);
  readonly serviceUrl = 'https://ol-zoomify.surge.sh/zoomify/';

  constructor() {
    effect(() => {
      const map = this.map();
      const source = this.source();

      if (!map || !source?.instance || this.viewReady()) {
        return;
      }

      const tileGrid = source.instance.getTileGrid();
      if (!tileGrid) {
        return;
      }

      const extent = tileGrid.getExtent();
      if (!extent) {
        return;
      }

      const view = new View({
        resolutions: tileGrid.getResolutions(),
        extent,
        constrainOnlyCenter: true,
      });
      map.instance.setView(view);
      view.fit(extent, {
        size: map.instance.getSize(),
      });
      this.viewReady.set(true);
    });
  }
}
