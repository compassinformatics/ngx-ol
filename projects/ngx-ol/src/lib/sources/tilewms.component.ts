import {
  Component,
  Host,
  Input,
  OnChanges,
  OnInit,
  forwardRef,
  SimpleChanges,
} from '@angular/core';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceComponent } from './source.component';
import TileWMS from 'ol/source/TileWMS';
import { Options } from 'ol/source/TileWMS';
import TileGrid from 'ol/tilegrid/TileGrid';
import { LoadFunction } from 'ol/Tile';
import ImageTile from 'ol/ImageTile';
import { NearestDirectionFunction } from 'ol/array';
import { ProjectionLike } from 'ol/proj';
import { ServerType } from 'ol/source/wms';

@Component({
  selector: 'aol-source-tilewms',
  template: ` <ng-content></ng-content> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceTileWMSComponent) }],
})
export class SourceTileWMSComponent extends SourceComponent implements OnChanges, OnInit {
  @Input() cacheSize?: number;
  @Input() crossOrigin?: null | string;
  @Input() gutter?: number;
  @Input() hidpi?: boolean;
  @Input() interpolate?: boolean;
  @Input() params: { [key: string]: any };
  @Input() projection?: ProjectionLike;
  @Input() reprojectionErrorThreshold?: number;
  @Input() serverType?: ServerType;
  @Input() tileClass?: typeof ImageTile;
  @Input() tileGrid?: TileGrid;
  @Input() tileLoadFunction?: LoadFunction;
  @Input() url?: string;
  @Input() urls?: string[];
  @Input() wrapX?: boolean;
  @Input() transition?: number;
  @Input() zDirection?: number | NearestDirectionFunction;

  instance: TileWMS;

  constructor(@Host() layer: LayerTileComponent) {
    super(layer);
  }

  ngOnInit() {
    this.instance = new TileWMS(this.createOptions());
    this.host.instance.setSource(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.instance && changes.hasOwnProperty('params')) {
      this.instance.updateParams(this.params);
    }
  }

  private createOptions(): Options {
    return {
      attributions: this.attributions,
      attributionsCollapsible: this.attributionsCollapsible,
      cacheSize: this.cacheSize,
      crossOrigin: this.crossOrigin,
      gutter: this.gutter,
      hidpi: this.hidpi,
      interpolate: this.interpolate,
      params: this.params,
      projection: this.projection,
      reprojectionErrorThreshold: this.reprojectionErrorThreshold,
      serverType: this.serverType,
      tileClass: this.tileClass,
      tileGrid: this.tileGrid,
      tileLoadFunction: this.tileLoadFunction,
      url: this.url,
      urls: this.urls,
      wrapX: this.wrapX,
      transition: this.transition,
      zDirection: this.zDirection,
    };
  }
}
