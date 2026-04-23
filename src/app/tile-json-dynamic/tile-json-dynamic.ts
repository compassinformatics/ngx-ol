import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import TileJSON from 'ol/source/TileJSON';
import type { Coordinate } from 'ol/coordinate';
import { transform } from 'ol/proj';

@Component({
  selector: 'app-tile-json-dynamic',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './tile-json-dynamic.html',
  styleUrl: './tile-json-dynamic.less',
})
export class TileJsonDynamic {
  readonly center = signal<Coordinate>(
    transform([-2.269282, 46.987247], 'EPSG:4326', 'EPSG:3857'),
  );
  readonly zoom = signal(3);
  readonly url = signal('/tile-json/carto-light.json');
  readonly jsonSource = signal(
    new TileJSON({
      url: this.url(),
    }),
  );
}
