import { ChangeDetectionStrategy, Component, effect, signal, viewChild } from '@angular/core';
import { AngularOpenlayersModule, MapComponent } from 'ngx-ol';
import { Coordinate } from 'ol/coordinate';

@Component({
  selector: 'app-basic-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './basic-map.html',
  styleUrl: './basic-map.less',
})
export class BasicMap {
  private readonly map = viewChild<MapComponent>('map');

  readonly zoom = signal(7);
  readonly center = signal<Coordinate>([-871993.618677, 7062781.41355]);

  constructor() {
    effect(() => {
      console.log('Basic map instance:', this.map()?.instanceSignal());
    });
  }
}
