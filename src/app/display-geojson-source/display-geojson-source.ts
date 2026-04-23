import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import { transform } from 'ol/proj';
import { AngularOpenlayersModule } from 'ngx-ol';

@Component({
  selector: 'app-display-geojson-source',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './display-geojson-source.html',
  styleUrl: './display-geojson-source.less',
})
export class DisplayGeojsonSource {
  readonly zoom = signal(4);
  readonly center = signal<Coordinate>(transform([1.4886, 43.5554], 'EPSG:4326', 'EPSG:3857'));
  readonly geojsonUrl = signal(
    'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json',
  );
}
