import { Component, OnInit } from '@angular/core';
import { TileJSON } from 'ol/source';

@Component({
  selector: 'app-tile-json-dynamic',
  template: `
    <aol-map #map width="100%" height="100%">
      <aol-view [zoom]="3">
        <aol-coordinate [x]="-2.269282" [y]="46.987247" [srid]="'EPSG:4326'"></aol-coordinate>
      </aol-view>

      <aol-interaction-default></aol-interaction-default>
      <aol-control-defaults></aol-control-defaults>
      <aol-layer-tile [source]="jsonSource"> </aol-layer-tile>
    </aol-map>
  `,
})
export class TileJsonDynamicComponent implements OnInit {
  constructor() {}
  jsonSource: TileJSON;

  ngOnInit(): void {
    this.jsonSource = new TileJSON({
      url: 'https://maps.gnosis.earth/ogcapi/collections/NaturalEarth:raster:HYP_HR_SR_OB_DR/map/tiles/WebMercatorQuad?f=tilejson',
    });
  }
}
