import {
  Component,
  Host,
  Input,
  forwardRef,
  AfterContentInit,
  ContentChild,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceComponent } from './source.component';
import { TileGridWMTSComponent } from '../tilegridwmts.component';
import SourceWMTS from 'ol/source/WMTS';
import WMTS from 'ol/tilegrid/WMTS';
import { ProjectionLike } from 'ol/proj';
import { LoadFunction } from 'ol/Tile';
import { TileSourceEvent } from 'ol/source/Tile';
import { Options, RequestEncoding } from 'ol/source/WMTS';
import { NearestDirectionFunction } from 'ol/array';

@Component({
  selector: 'aol-source-tilewmts',
  template: ` <ng-content></ng-content> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceTileWMTSComponent) }],
})
export class SourceTileWMTSComponent
  extends SourceComponent
  implements AfterContentInit, OnChanges
{
  @Input() cacheSize?: number;
  @Input() crossOrigin?: null | string;
  @Input() interpolate?: boolean;
  @Input() tileGrid: WMTS;
  @Input() projection?: ProjectionLike;
  @Input() reprojectionErrorThreshold?: number;
  @Input() requestEncoding?: RequestEncoding | undefined;
  @Input() layer: string;
  @Input() style: string;
  @Input() tileClass?: any;
  @Input() tilePixelRatio?: number;
  @Input() version?: string;
  @Input() format?: string;
  @Input() matrixSet: string;
  @Input() dimensions?: any;
  @Input() url?: string;
  @Input() tileLoadFunction?: LoadFunction;
  @Input() urls?: string[];
  @Input() wrapX?: boolean;
  @Input() transition?: number;
  @Input() zDirection?: number | NearestDirectionFunction;

  @Output() tileLoadStart = new EventEmitter<TileSourceEvent>();
  @Output() tileLoadEnd = new EventEmitter<TileSourceEvent>();
  @Output() tileLoadError = new EventEmitter<TileSourceEvent>();

  @ContentChild(TileGridWMTSComponent, { static: false }) tileGridWMTS: TileGridWMTSComponent;

  instance: SourceWMTS;

  constructor(@Host() layer: LayerTileComponent) {
    super(layer);
  }

  ngOnChanges(changes: SimpleChanges) {
    const properties: { [index: string]: any } = {};
    if (!this.instance) {
      return;
    }
    for (const key in changes) {
      if (changes.hasOwnProperty(key)) {
        switch (key) {
          case 'url':
            this.url = changes[key].currentValue;
            this.setLayerSource();
            break;
          default:
            break;
        }
        properties[key] = changes[key].currentValue;
      }
    }
    this.instance.setProperties(properties, false);
  }

  setLayerSource(): void {
    this.instance = new SourceWMTS(this.createOptions());
    this.instance.on('tileloadstart', (event: TileSourceEvent) => this.tileLoadStart.emit(event));
    this.instance.on('tileloadend', (event: TileSourceEvent) => this.tileLoadEnd.emit(event));
    this.instance.on('tileloaderror', (event: TileSourceEvent) => this.tileLoadError.emit(event));
    this.host.instance.setSource(this.instance);
  }

  ngAfterContentInit(): void {
    if (this.tileGridWMTS) {
      this.tileGrid = this.tileGridWMTS.instance;
    }
    if (this.tileGrid) {
      this.setLayerSource();
    }
  }

  private createOptions(): Options {
    return {
      attributions: this.attributions,
      attributionsCollapsible: this.attributionsCollapsible,
      cacheSize: this.cacheSize,
      crossOrigin: this.crossOrigin,
      interpolate: this.interpolate,
      tileGrid: this.tileGrid,
      projection: this.projection,
      reprojectionErrorThreshold: this.reprojectionErrorThreshold,
      requestEncoding: this.requestEncoding,
      layer: this.layer,
      style: this.style,
      tileClass: this.tileClass,
      tilePixelRatio: this.tilePixelRatio,
      format: this.format,
      version: this.version,
      matrixSet: this.matrixSet,
      dimensions: this.dimensions,
      url: this.url,
      tileLoadFunction: this.tileLoadFunction,
      urls: this.urls,
      wrapX: this.wrapX,
      transition: this.transition,
      zDirection: this.zDirection,
    };
  }
}
