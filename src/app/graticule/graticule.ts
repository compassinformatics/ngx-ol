import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import { Stroke } from 'ol/style';
import type { Coordinate } from 'ol/coordinate';

@Component({
  selector: 'app-graticule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './graticule.html',
  styleUrl: './graticule.less',
})
export class Graticule {
  readonly center = signal<Coordinate>([-10997148, 4569099]);
  readonly zoom = signal(4);
  readonly shownGraticule = signal(true);
  readonly graticuleStyle = signal(
    new Stroke({
      color: 'rgba(255,120,0,0.9)',
      width: 2,
      lineDash: [0.5, 4],
    }),
  );

  protected setShownGraticule(value: boolean): void {
    this.shownGraticule.set(value);
  }
}
