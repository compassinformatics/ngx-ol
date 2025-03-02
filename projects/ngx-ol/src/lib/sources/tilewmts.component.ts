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
import { WMTS as SourceWMTS } from 'ol/source';
import WMTS from 'ol/tilegrid/WMTS';
import { ProjectionLike } from 'ol/proj';
import { LoadFunction } from 'ol/Tile';
import { TileSourceEvent } from 'ol/source/Tile';
import { RequestEncoding } from 'ol/source/WMTS';

@Component({
  selector: 'aol-source-tilewmts',
  template: ` <ng-content></ng-content> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceTileWMTSComponent) }],
})
export class SourceTileWMTSComponent
  extends SourceComponent
  implements AfterContentInit, OnChanges
{
  @Input()
  cacheSize?: number;
  @Input()
  crossOrigin?: null | string;
  @Input()
  tileGrid: WMTS;
  @Input()
  projection?: ProjectionLike;
  @Input()
  reprojectionErrorThreshold?: number;
  @Input()
  requestEncoding?: RequestEncoding | undefined;
  @Input()
  layer: string;
  @Input()
  style: string;
  @Input()
  tileClass?: any;
  @Input()
  tilePixelRatio?: number;
  @Input()
  version?: string;
  @Input()
  format?: string;
  @Input()
  matrixSet: string;
  @Input()
  dimensions?: any;
  @Input()
  url?: string;
  @Input()
  tileLoadFunction?: LoadFunction;
  @Input()
  urls?: string[];
  @Input()
  wrapX?: boolean;

  @Output()
  tileLoadStart = new EventEmitter<TileSourceEvent>();
  @Output()
  tileLoadEnd = new EventEmitter<TileSourceEvent>();
  @Output()
  tileLoadError = new EventEmitter<TileSourceEvent>();

  @ContentChild(TileGridWMTSComponent, { static: false })
  tileGridWMTS: TileGridWMTSComponent;

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
    this.instance = new SourceWMTS(this);
    this.instance.on('tileloadstart', (event: TileSourceEvent) => this.tileLoadStart.emit(event));
    this.instance.on('tileloadend', (event: TileSourceEvent) => this.tileLoadEnd.emit(event));
    this.instance.on('tileloaderror', (event: TileSourceEvent) => this.tileLoadError.emit(event));
    this.host.instance.setSource(this.instance);
  }

  ngAfterContentInit(): void {
    if (this.tileGridWMTS) {
      this.tileGrid = this.tileGridWMTS.instance;
      this.setLayerSource();
    }
  }
}
