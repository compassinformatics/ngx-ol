import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import { fromLonLat } from 'ol/proj.js';

@Component({
  selector: 'app-link-interaction',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './link-interaction.html',
  styleUrl: './link-interaction.less',
})
export class LinkInteractionDemo {
  readonly center = signal(fromLonLat([-8.2, 53.45]));
  readonly zoom = signal(7);
}
