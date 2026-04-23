import { Component, signal } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import { AngularOpenlayersModule } from '../../../projects/ngx-ol/src/public-api';
import { LayerList } from './layer-list/layer-list';
import { layers as initialLayers, LayerType } from './layers';

@Component({
  selector: 'app-advanced-map',
  imports: [AngularOpenlayersModule, LayerList],
  templateUrl: './advanced-map.html',
  styleUrl: './advanced-map.less',
})
export class AdvancedMap {
  readonly zoom = signal(7);
  readonly center = signal<Coordinate>([-871993.618677, 7062781.41355]);

  protected layers = signal(initialLayers);
  protected LayerType = LayerType;
}
