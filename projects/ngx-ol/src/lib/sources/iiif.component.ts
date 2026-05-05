import { Component, forwardRef, Host, Input, OnInit, Optional } from '@angular/core';
import type { NearestDirectionFunction } from 'ol/array';
import type { Extent } from 'ol/extent';
import type { ProjectionLike } from 'ol/proj';
import type { Size } from 'ol/size';
import IIIF from 'ol/source/IIIF';
import type { Options } from 'ol/source/IIIF';
import type { State } from 'ol/source/Source';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceComponent } from './source.component';

@Component({
  selector: 'aol-source-iiif',
  template: '',
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceIIIFComponent) }],
})
export class SourceIIIFComponent extends SourceComponent implements OnInit {
  @Input() cacheSize?: number;

  @Input() crossOrigin?: string | null;

  @Input() extent?: Extent;

  @Input() format?: string;

  @Input() interpolate?: boolean;

  @Input() projection?: ProjectionLike;

  @Input() quality?: string;

  @Input() reprojectionErrorThreshold?: number;

  @Input() resolutions?: number[];

  @Input() size: Size;

  @Input() sizes?: Size[];

  @Input() state?: State;

  @Input() supports?: string[];

  @Input() tilePixelRatio?: number;

  @Input() tileSize?: number | Size;

  @Input() transition?: number;

  @Input() url?: string;

  @Input() version?: string;

  @Input() zDirection?: number | NearestDirectionFunction;

  instance: IIIF;

  constructor(@Optional() @Host() layer?: LayerTileComponent) {
    super(layer!);
  }

  ngOnInit() {
    this.instance = new IIIF(this.createOptions());
    this.register(this.instance);
  }

  private createOptions(): Options {
    return {
      attributions: this.attributions,
      attributionsCollapsible: this.attributionsCollapsible,
      cacheSize: this.cacheSize,
      crossOrigin: this.crossOrigin,
      extent: this.extent,
      format: this.format,
      interpolate: this.interpolate,
      projection: this.projection,
      quality: this.quality,
      reprojectionErrorThreshold: this.reprojectionErrorThreshold,
      resolutions: this.resolutions,
      size: this.size,
      sizes: this.sizes,
      state: this.state,
      supports: this.supports,
      tilePixelRatio: this.tilePixelRatio,
      tileSize: this.tileSize,
      transition: this.transition,
      url: this.url,
      version: this.version,
      zDirection: this.zDirection,
    };
  }
}
