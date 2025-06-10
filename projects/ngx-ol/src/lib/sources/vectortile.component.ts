import { Component, Host, Input, forwardRef, ContentChild, AfterContentInit } from '@angular/core';
import { VectorTile } from 'ol/source';
import Feature from 'ol/format/Feature';
import TileGrid from 'ol/tilegrid/TileGrid';
import { LayerVectorTileComponent } from '../layers/layervectortile.component';
import { TileGridComponent } from '../tilegrid.component';
import { SourceComponent } from './source.component';
import { ProjectionLike } from 'ol/proj';
import { LoadFunction, UrlFunction } from 'ol/Tile';
import { FormatGeoJSONComponent } from '../formats/geojson.component';
import { FormatMVTComponent } from '../formats/mvt.component';
import FeatureFormat from 'ol/format/Feature';

@Component({
  selector: 'aol-source-vectortile',
  template: ` <ng-content></ng-content> `,
  providers: [
    { provide: SourceComponent, useExisting: forwardRef(() => SourceVectorTileComponent) },
  ],
})
export class SourceVectorTileComponent extends SourceComponent implements AfterContentInit {
  @Input()
  cacheSize?: number;
  @Input()
  overlaps: boolean;
  @Input()
  projection?: ProjectionLike;
  @Input()
  tilePixelRatio: number;
  @Input()
  tileUrlFunction?: UrlFunction;
  @Input()
  tileLoadFunction?: LoadFunction;
  @Input()
  url?: string;
  @Input()
  urls?: string[];
  @Input()
  wrapX: boolean;
  @Input()
  format?: any;

  @ContentChild(FormatMVTComponent, { static: false })
  formatMVTComponent: FormatMVTComponent;
  @ContentChild(FormatGeoJSONComponent, { static: false })
  formatGeoJSONComponent: FormatGeoJSONComponent;
  @ContentChild(TileGridComponent, { static: false })
  tileGridComponent: TileGridComponent;

  public instance: VectorTile;
  tileGrid: TileGrid;

  constructor(@Host() layer: LayerVectorTileComponent) {
    super(layer);
  }

  ngAfterContentInit() {
    let format: any = this.format;
    if (this.formatMVTComponent) {
      format = this.formatMVTComponent.instance;
    }
    if (this.formatGeoJSONComponent) {
      format = this.formatGeoJSONComponent.instance;
    }
    this.tileGrid = this.tileGridComponent.instance;

    this.instance = new VectorTile(Object.assign({format}, this));
    this.host.instance.setSource(this.instance);
  }
}
