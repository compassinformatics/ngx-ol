import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import { Coordinate } from 'ol/coordinate';

@Component({
  selector: 'app-basic-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './basic-map.html',
  styleUrl: './basic-map.less',
})
export class BasicMap {
  readonly zoom = signal(7);
  readonly center = signal<Coordinate>([-871993.618677, 7062781.41355]);
}
