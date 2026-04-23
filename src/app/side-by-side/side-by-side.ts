import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  signal,
  viewChild,
} from '@angular/core';
import { AngularOpenlayersModule, MapComponent, ViewComponent } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate';
import { transform } from 'ol/proj';

@Component({
  selector: 'app-side-by-side',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './side-by-side.html',
  styleUrl: './side-by-side.less',
})
export class SideBySide {
  private readonly secondMap = viewChild.required<MapComponent>('secondMap');
  private readonly sharedView = viewChild.required<ViewComponent>('sharedView');

  readonly center = signal<Coordinate>(transform([2.181539, 47.125488], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(5);

  constructor() {
    afterNextRender(() => {
      this.secondMap().instance.setView(this.sharedView().instance);
    });
  }
}
