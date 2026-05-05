import {
  Component,
  forwardRef,
  Host,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import type { NearestDirectionFunction } from 'ol/array';
import type { ProjectionLike } from 'ol/proj';
import TileGrid from 'ol/tilegrid/TileGrid';
import type { LoadFunction } from 'ol/Tile';
import TileArcGISRest from 'ol/source/TileArcGISRest';
import type { Options } from 'ol/source/TileArcGISRest';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceComponent } from './source.component';

@Component({
  selector: 'aol-source-tilearcgisrest',
  template: ` <ng-content></ng-content> `,
  providers: [
    { provide: SourceComponent, useExisting: forwardRef(() => SourceTileArcGISRestComponent) },
  ],
})
export class SourceTileArcGISRestComponent extends SourceComponent implements OnInit, OnChanges {
  @Input() cacheSize?: number;

  @Input() crossOrigin?: string | null;

  @Input() interpolate?: boolean;

  @Input() params?: { [key: string]: any };

  @Input() hidpi?: boolean;

  @Input() tileGrid?: TileGrid;

  @Input() projection?: ProjectionLike;

  @Input() reprojectionErrorThreshold?: number;

  @Input() tileLoadFunction?: LoadFunction;

  @Input() url?: string;

  @Input() wrapX?: boolean;

  @Input() transition?: number;

  @Input() urls?: string[];

  @Input() zDirection?: number | NearestDirectionFunction;

  instance: TileArcGISRest;

  constructor(@Host() layer: LayerTileComponent) {
    super(layer);
  }

  ngOnInit() {
    this.instance = new TileArcGISRest(this.createOptions());
    this.host.instance.setSource(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.instance && changes.hasOwnProperty('params') && this.params) {
      this.instance.updateParams(this.params);
    }
  }

  private createOptions(): Options {
    return {
      attributions: this.attributions,
      cacheSize: this.cacheSize,
      crossOrigin: this.crossOrigin,
      interpolate: this.interpolate,
      params: this.params,
      hidpi: this.hidpi,
      tileGrid: this.tileGrid,
      projection: this.projection,
      reprojectionErrorThreshold: this.reprojectionErrorThreshold,
      tileLoadFunction: this.tileLoadFunction,
      url: this.url,
      wrapX: this.wrapX,
      transition: this.transition,
      urls: this.urls,
      zDirection: this.zDirection,
    };
  }
}
