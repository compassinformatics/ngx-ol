import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate';
import { transform } from 'ol/proj';

@Component({
  selector: 'app-tile-json',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './tile-json.html',
  styleUrl: './tile-json.less',
})
export class TileJson {
  readonly center = signal<Coordinate>(
    transform([-2.269282, 46.987247], 'EPSG:4326', 'EPSG:3857'),
  );
  readonly zoom = signal(3);
  readonly url = signal('/tile-json/carto-light.json');
}
