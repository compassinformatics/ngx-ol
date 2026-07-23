import { Component, signal } from '@angular/core';
import { AngularOpenlayersMapModule, AngularOpenlayersTileLayersModule } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate.js';

@Component({
  selector: 'app-sub-modules',
  imports: [AngularOpenlayersMapModule, AngularOpenlayersTileLayersModule],
  templateUrl: './sub-modules.html',
  styleUrl: './sub-modules.less',
})
export class SubModules {
  readonly zoom = signal(7);
  readonly center = signal<Coordinate>([-871993.618677, 7062781.41355]);

  readonly usedModules: readonly string[] = [
    'AngularOpenlayersMapModule',
    'AngularOpenlayersTileLayersModule',
  ];
}
