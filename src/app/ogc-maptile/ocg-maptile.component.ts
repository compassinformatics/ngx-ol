import { Component, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from '../../../projects/ngx-ol/src/public-api';

@Component({
  selector: 'app-root',
  template: `
    <aol-map #map width="100%" height="100%">
      <aol-interaction-default></aol-interaction-default>
      <aol-view [zoom]="9" [center]="[-907904, 7065770]"></aol-view>
      <aol-layer-tile>
        <aol-source-ogcmaptile
          [url]="'https://maps.gnosis.earth/ogcapi/collections/blueMarble/map/tiles/WebMercatorQuad'"
        >
        <aol-format-mvt></aol-format-mvt>
      </aol-source-ogcmaptile>
      </aol-layer-tile>
    </aol-map>
  `,
  styles: [
    `
      map {
        background: #e0eced;
      }
    `,
  ],
})
export class OGCMapTileComponent implements OnInit {
  @ViewChild('map') mapComponent: MapComponent;
  constructor() {}
  ngOnInit() {}
}
