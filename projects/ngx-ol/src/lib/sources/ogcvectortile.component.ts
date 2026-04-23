import { Component, Host, Input, forwardRef, ContentChild, AfterContentInit } from '@angular/core';
import { OGCVectorTile } from 'ol/source';
import { Options } from 'ol/source/OGCVectorTile';
import TileGrid from 'ol/tilegrid/TileGrid';
import { LayerVectorTileComponent } from '../layers/layervectortile.component';
import { SourceComponent } from './source.component';
import { ProjectionLike } from 'ol/proj';
import VectorTile from 'ol/VectorTile';
import { NearestDirectionFunction } from 'ol/array';
import { FormatMVTComponent } from '../formats/mvt.component';
import { FormatGeoJSONComponent } from '../formats/geojson.component';
import FeatureFormat from 'ol/format/Feature';

@Component({
  selector: 'aol-source-ogcvectortile',
  template: ` <ng-content></ng-content> `,
  providers: [
    { provide: SourceComponent, useExisting: forwardRef(() => SourceOGCVectorTileComponent) },
  ],
})
export class SourceOGCVectorTileComponent extends SourceComponent implements AfterContentInit {
  @Input() url: string;
  @Input() context?: any;
  @Input() mediaType?: string;
  @Input() cacheSize?: number;
  @Input() overlaps?: boolean;
  @Input() projection?: ProjectionLike;
  @Input() tileClass?: typeof VectorTile;
  @Input() transition?: number;
  @Input() wrapX?: boolean;
  @Input() zDirection?: number | NearestDirectionFunction;
  @Input() collections?: string[];
  @Input() format?: FeatureFormat<any>;

  @ContentChild(FormatMVTComponent, { static: false })
  formatMVTComponent: FormatMVTComponent | FormatGeoJSONComponent;
  @ContentChild(FormatGeoJSONComponent, { static: false })
  formatGeoJSONComponent: FormatGeoJSONComponent;

  public instance: OGCVectorTile;
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

    this.instance = new OGCVectorTile(this.createOptions(format));
    this.host.instance.setSource(this.instance);
  }

  private createOptions(format: FeatureFormat<any> | undefined): Options<any> {
    return {
      url: this.url,
      context: this.context,
      format,
      mediaType: this.mediaType,
      attributions: this.attributions,
      attributionsCollapsible: this.attributionsCollapsible,
      cacheSize: this.cacheSize,
      overlaps: this.overlaps,
      projection: this.projection,
      tileClass: this.tileClass,
      transition: this.transition,
      wrapX: this.wrapX,
      zDirection: this.zDirection,
      collections: this.collections,
    };
  }
}
