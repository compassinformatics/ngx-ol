import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  AngularOpenlayersMapModule,
  AngularOpenlayersTileLayersModule,
} from 'ngx-ol';
import type { Style } from 'ol/layer/WebGLTile';
import { fromLonLat } from 'ol/proj';

@Component({
  selector: 'app-webgl-tile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersMapModule, AngularOpenlayersTileLayersModule],
  templateUrl: './webgl-tile.html',
  styleUrl: './webgl-tile.less',
})
export class WebglTile {
  readonly center = signal(fromLonLat([-8.2, 53.45]));
  readonly zoom = signal(7);
  readonly sourceUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  readonly style = signal<Style>({
    saturation: -0.35,
    contrast: 0.15,
  });
}
