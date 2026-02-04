import { Component, Host, Input, forwardRef, ContentChild, AfterContentInit } from '@angular/core';
import { OGCVectorTile } from 'ol/source';
import TileGrid from 'ol/tilegrid/TileGrid';
import { LayerVectorTileComponent } from '../layers/layervectortile.component';
import { SourceComponent } from './source.component';
import { ProjectionLike } from 'ol/proj';
import { FormatMVTComponent } from '../formats/mvt.component';
import { FormatGeoJSONComponent } from '../formats/geojson.component';

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
  @Input() tileClass?: any;
  @Input() transition?: number;
  @Input() wrapX?: boolean;
  @Input() zDirection?: number;
  @Input() collections?: string[];
  @Input() format?: any;

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
    let format: any = this.format;
    if (this.formatMVTComponent) {
      format = this.formatMVTComponent.instance;
    }
    if (this.formatGeoJSONComponent) {
      format = this.formatGeoJSONComponent.instance;
    }

    this.instance = new OGCVectorTile(Object.assign({ format }, this));
    this.host.instance.setSource(this.instance);
  }
}
