import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  AngularOpenlayersMapInteractionsModule,
  AngularOpenlayersMapModule,
  AngularOpenlayersTileLayersModule,
} from 'ngx-ol';
import { fromLonLat } from 'ol/proj';

@Component({
  selector: 'app-dbl-click-drag-zoom',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AngularOpenlayersMapModule,
    AngularOpenlayersMapInteractionsModule,
    AngularOpenlayersTileLayersModule,
  ],
  templateUrl: './dbl-click-drag-zoom.html',
  styleUrl: './dbl-click-drag-zoom.less',
})
export class DblClickDragZoomDemo {
  readonly center = signal(fromLonLat([-8.2, 53.45]));
  readonly zoom = signal(7);
  readonly duration = signal(250);
  readonly delta = signal(0.01);
}
