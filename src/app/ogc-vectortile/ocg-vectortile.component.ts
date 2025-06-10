import { Component, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from '../../../projects/ngx-ol/src/public-api';

@Component({
  selector: 'app-root',
  template: `
    <aol-map #map width="100%" height="100%">
      <aol-interaction-default></aol-interaction-default>
      <aol-view [zoom]="9" [center]="[-907904, 7065770]"></aol-view>
      <aol-layer-vectortile>
        <aol-source-ogcvectortile
          [url]="'https://maps.gnosis.earth/ogcapi/collections/NaturalEarth:cultural:ne_10m_admin_0_countries/tiles/WebMercatorQuad'"
        >
        <aol-format-mvt></aol-format-mvt>
      </aol-source-ogcvectortile>
      </aol-layer-vectortile>
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
export class OGCVectorTileComponent implements OnInit {
  @ViewChild('map') mapComponent: MapComponent;
  constructor() {}
  ngOnInit() {}
}
