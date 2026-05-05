import { Component, forwardRef, Host, Input, OnChanges, OnInit, Optional, SimpleChanges } from '@angular/core';
import type { ProjectionLike } from 'ol/proj';
import type { Size } from 'ol/size';
import ImageTileSource from 'ol/source/ImageTile';
import type { CrossOriginAttribute } from 'ol/source/DataTile';
import type { Loader, Options, UrlLike } from 'ol/source/ImageTile';
import type { State } from 'ol/source/Source';
import TileGrid from 'ol/tilegrid/TileGrid';
import { LayerWebGLTileComponent } from '../layers/layerwebgltile.component';
import { SourceComponent } from './source.component';

@Component({
  selector: 'aol-source-imagetile',
  template: ` <ng-content></ng-content> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceImageTileComponent) }],
})
export class SourceImageTileComponent extends SourceComponent implements OnInit, OnChanges {
  @Input()
  url?: UrlLike;

  @Input()
  loader?: Loader;

  @Input()
  maxZoom?: number;

  @Input()
  minZoom?: number;

  @Input()
  tileSize?: number | Size;

  @Input()
  gutter?: number;

  @Input()
  maxResolution?: number;

  @Input()
  projection?: ProjectionLike;

  @Input()
  tileGrid?: TileGrid;

  @Input()
  state?: State;

  @Input()
  wrapX?: boolean;

  @Input()
  transition?: number;

  @Input()
  interpolate?: boolean;

  @Input()
  crossOrigin?: CrossOriginAttribute;

  instance: ImageTileSource;

  constructor(@Optional() @Host() layer?: LayerWebGLTileComponent) {
    super(layer!);
  }

  ngOnInit() {
    this.instance = new ImageTileSource(this.createOptions());
    this.register(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.instance && changes.url?.currentValue) {
      this.instance.setUrl(changes.url.currentValue);
    }
  }

  private createOptions(): Options {
    return {
      url: this.url,
      loader: this.loader,
      attributions: this.attributions,
      attributionsCollapsible: this.attributionsCollapsible,
      maxZoom: this.maxZoom,
      minZoom: this.minZoom,
      tileSize: this.tileSize,
      gutter: this.gutter,
      maxResolution: this.maxResolution,
      projection: this.projection,
      tileGrid: this.tileGrid,
      state: this.state,
      wrapX: this.wrapX,
      transition: this.transition,
      interpolate: this.interpolate,
      crossOrigin: this.crossOrigin,
    };
  }
}
