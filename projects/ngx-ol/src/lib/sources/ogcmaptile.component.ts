import { AfterContentInit, Component, Host, Input, forwardRef } from '@angular/core';
import { ProjectionLike } from 'ol/proj';
import { OGCMapTile } from 'ol/source';
import { Options } from 'ol/source/OGCMapTile';
import { LoadFunction } from 'ol/Tile';
import { SourceComponent } from './source.component';
import { LayerTileComponent } from '../layers/layertile.component';

@Component({
  selector: 'aol-source-ogcmaptile',
  template: ` <ng-content></ng-content> `,
  providers: [
    { provide: SourceComponent, useExisting: forwardRef(() => SourceOGCMapTileComponent) },
  ],
})
export class SourceOGCMapTileComponent extends SourceComponent implements AfterContentInit {
  @Input() url: string;
  @Input() context?: any;
  @Input() mediaType?: string;
  @Input() projection?: ProjectionLike;
  @Input() cacheSize?: number;
  @Input() crossOrigin?: null | string;
  @Input() interpolate?: boolean;
  @Input() reprojectionErrorThreshold?: number;
  @Input() tileLoadFunction?: LoadFunction;
  @Input() wrapX?: boolean;
  @Input() transition?: number;
  @Input() collections?: string[];

  public instance: OGCMapTile;

  constructor(@Host() layer: LayerTileComponent) {
    super(layer);
  }

  ngAfterContentInit() {
    this.instance = new OGCMapTile(this.createOptions());
    this.host.instance.setSource(this.instance);
  }

  private createOptions(): Options {
    return {
      url: this.url,
      context: this.context,
      mediaType: this.mediaType,
      projection: this.projection,
      attributions: this.attributions,
      cacheSize: this.cacheSize,
      crossOrigin: this.crossOrigin,
      interpolate: this.interpolate,
      reprojectionErrorThreshold: this.reprojectionErrorThreshold,
      tileLoadFunction: this.tileLoadFunction,
      wrapX: this.wrapX,
      transition: this.transition,
      collections: this.collections,
    };
  }
}
