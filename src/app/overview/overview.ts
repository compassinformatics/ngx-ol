import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate';
import { transform } from 'ol/proj';

@Component({
  selector: 'app-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './overview.html',
  styleUrl: './overview.less',
})
export class Overview {
  readonly center = signal<Coordinate>(transform([5, 45], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(15);
}
