import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate';

@Component({
  selector: 'app-ogc-map-tile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './ogc-map-tile.html',
  styleUrl: './ogc-map-tile.less',
})
export class OgcMapTile {
  readonly center = signal<Coordinate>([0, 0]);
  readonly zoom = signal(2);
  readonly mediaType = signal('image/png');
  readonly url = signal('/ogc-map-tiles/carto-light-webmercatorquad.json');
}
