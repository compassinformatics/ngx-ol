import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';

@Component({
  selector: 'app-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './overview.html',
  styleUrl: './overview.less',
})
export class Overview {
  readonly center = signal<Coordinate>([500000, 6000000]);
  readonly zoom = signal(7);
  readonly source = new OSM();
  readonly overviewLayers = [new TileLayer({ source: this.source })];
}
