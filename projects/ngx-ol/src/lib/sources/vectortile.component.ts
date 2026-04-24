import { Component, Host, Input, forwardRef, ContentChild, AfterContentInit } from '@angular/core';
import { VectorTile } from 'ol/source';
import { Options } from 'ol/source/VectorTile';
import TileGrid from 'ol/tilegrid/TileGrid';
import OlVectorTile from 'ol/VectorTile';
import { LayerVectorTileComponent } from '../layers/layervectortile.component';
import { TileGridComponent } from '../tilegrid.component';
import { SourceComponent } from './source.component';
import { ProjectionLike } from 'ol/proj';
import { LoadFunction, UrlFunction } from 'ol/Tile';
import { NearestDirectionFunction } from 'ol/array';
import { Extent } from 'ol/extent';
import { Size } from 'ol/size';
import { State } from 'ol/source/Source';
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
  extent?: Extent;
  @Input()
  overlaps?: boolean;
  @Input()
  projection?: ProjectionLike;
  @Input()
  state?: State;
  @Input()
  tileClass?: typeof OlVectorTile;
  @Input()
  maxZoom?: number;
  @Input()
  minZoom?: number;
  @Input()
  tileSize?: number | Size;
  @Input()
  maxResolution?: number;
  @Input()
  tileUrlFunction?: UrlFunction;
  @Input()
  tileLoadFunction?: LoadFunction;
  @Input()
  url?: string;
  @Input()
  urls?: string[];
  @Input()
  transition?: number;
  @Input()
  wrapX?: boolean;
  @Input()
  zDirection?: number | NearestDirectionFunction;
  @Input()
  format?: FeatureFormat<any>;

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
    let format: FeatureFormat<any> | undefined = this.format;
    if (this.formatMVTComponent) {
      format = this.formatMVTComponent.instance;
    }
    if (this.formatGeoJSONComponent) {
      format = this.formatGeoJSONComponent.instance;
    }
    this.tileGrid = this.tileGridComponent.instance;

    this.instance = new VectorTile(this.createOptions(format));
    this.host.instance.setSource(this.instance);
  }

  private createOptions(format: FeatureFormat<any> | undefined): Options<any> {
    return {
      attributions: this.attributions,
      cacheSize: this.cacheSize,
      extent: this.extent,
      format,
      overlaps: this.overlaps,
      projection: this.projection,
      state: this.state,
      tileClass: this.tileClass,
      maxZoom: this.maxZoom,
      minZoom: this.minZoom,
      tileSize: this.tileSize,
      maxResolution: this.maxResolution,
      tileGrid: this.tileGrid,
      tileUrlFunction: this.tileUrlFunction,
      tileLoadFunction: this.tileLoadFunction,
      url: this.url,
      urls: this.urls,
      transition: this.transition,
      wrapX: this.wrapX,
      zDirection: this.zDirection,
    };
  }
}
