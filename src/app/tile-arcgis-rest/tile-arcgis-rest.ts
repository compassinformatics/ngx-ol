import { Component, signal } from '@angular/core';
import { AngularOpenlayersMapModule, AngularOpenlayersTileLayersModule } from 'ngx-ol';
import { fromLonLat } from 'ol/proj.js';

@Component({
  selector: 'app-tile-arcgis-rest',
  imports: [AngularOpenlayersMapModule, AngularOpenlayersTileLayersModule],
  templateUrl: './tile-arcgis-rest.html',
  styleUrl: './tile-arcgis-rest.less',
})
export class TileArcgisRest {
  readonly center = signal(fromLonLat([-95, 40]));
  readonly zoom = signal(4);
  readonly serviceUrl =
    'https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer';
}
