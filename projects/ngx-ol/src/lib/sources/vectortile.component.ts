import { Component, Host, Input, forwardRef, ContentChild, AfterContentInit } from '@angular/core';
import { VectorTile } from 'ol/source';
import Feature from 'ol/format/Feature';
import TileGrid from 'ol/tilegrid/TileGrid';
import { LayerVectorTileComponent } from '../layers/layervectortile.component';
import { FormatComponent } from '../formats/format.component';
import { TileGridComponent } from '../tilegrid.component';
import { SourceComponent } from './source.component';
import { ProjectionLike } from 'ol/proj';
import { LoadFunction, UrlFunction } from 'ol/Tile';

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

  @ContentChild(FormatComponent, { static: false })
  formatComponent: FormatComponent;
  @ContentChild(TileGridComponent, { static: false })
  tileGridComponent: TileGridComponent;

  public instance: VectorTile;
  format: Feature;
  tileGrid: TileGrid;

  constructor(@Host() layer: LayerVectorTileComponent) {
    super(layer);
  }

  /* need the children to construct the OL3 object */
  ngAfterContentInit() {
    this.format = this.formatComponent.instance;
    this.tileGrid = this.tileGridComponent.instance;
    // console.log('creating ol.source.VectorTile instance with:', this);
    this.instance = new VectorTile(this);
    this.host.instance.setSource(this.instance);
  }
}
