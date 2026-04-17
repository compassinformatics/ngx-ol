import { Component, ViewChild } from '@angular/core';
import { SourceUTFGridComponent, ViewComponent, AngularOpenlayersModule } from 'ngx-ol';
import { Coordinate } from 'ol/coordinate';


@Component({
    selector: 'app-root',
    template: `
    <aol-map (pointerMove)="displayInfo($event.coordinate)">
      <aol-interaction-default></aol-interaction-default>
      <aol-control-defaults></aol-control-defaults>
      <aol-control-fullscreen></aol-control-fullscreen>
      <aol-view #view [zoom]="2" [center]="[3000000, 3000000]"></aol-view>
      <aol-layer-tile> <aol-source-osm></aol-source-osm> </aol-layer-tile>
      <aol-layer-tile>
        <aol-source-utfgrid
          #UTFGrid
          [url]="
            'https://api.tiles.mapbox.com/v4/mapbox.geography-class.json'
          "
        ></aol-source-utfgrid>
      </aol-layer-tile>
      @if (coords && info) {
        <aol-overlay [positioning]="'bottom-right'" [stopEvent]="false">
          <aol-coordinate [x]="coords[0]" [y]="coords[1]" [srid]="'EPSG:3857'"> </aol-coordinate>
          <aol-content>
            <img [src]="'data:image/png;base64,' + info['flag_png']" />
          </aol-content>
        </aol-overlay>
      }
    </aol-map>
    `,
    styles: [
        `
      :host {
        height: 100%;
        display: flex;
      }

      aol-map {
        width: 100%;
        height: 100%;
      }
    `,
    ],
    imports: [AngularOpenlayersModule]
})
export class UTFGridComponent {
  @ViewChild('UTFGrid', { static: true }) UTFGrid: SourceUTFGridComponent;
  @ViewChild('view', { static: true }) view: ViewComponent;

  info: any;
  coords: Coordinate;

  displayInfo(c: Coordinate) {
    this.UTFGrid.instance.forDataAtCoordinateAndResolution(
      c,
      this.view.instance.getResolution() || 0,
      (data) => {
        if (data !== null && data !== undefined && data !== '') {
          this.info = data;
          this.coords = c;
        }
      },
    );
  }
}
