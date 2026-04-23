import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate';

@Component({
  selector: 'app-ogc-vector-tile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './ogc-vector-tile.html',
  styleUrl: './ogc-vector-tile.less',
})
export class OgcVectorTile {
  readonly center = signal<Coordinate>([-250000, 7000000]);
  readonly zoom = signal(6);
  readonly url = signal('https://demo.ldproxy.net/zoomstack/tiles/WebMercatorQuad');
}
