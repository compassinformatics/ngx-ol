import {
  signal,
  Component,
  Host,
  forwardRef,
  AfterContentInit,
  AfterContentChecked,
  ContentChild,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
  input,
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
  implements AfterContentInit, AfterContentChecked, OnChanges
{
  cacheSize = input<number>();
  crossOrigin = input<null | string>();
  interpolate = input<boolean>();
  tileGrid = input<WMTS>();
  projection = input<ProjectionLike>();
  reprojectionErrorThreshold = input<number>();
  requestEncoding = input<RequestEncoding | undefined>();
  layer = input.required<string>();
  style = input.required<string>();
  tileClass = input<any>();
  tilePixelRatio = input<number>();
  version = input<string>();
  format = input<string>();
  matrixSet = input.required<string>();
  dimensions = input<any>();
  url = input<string>();
  tileLoadFunction = input<LoadFunction>();
  urls = input<string[]>();
  wrapX = input<boolean>();
  transition = input<number>();
  zDirection = input<number | NearestDirectionFunction>();

  @Output() tileLoadStart = new EventEmitter<TileSourceEvent>();
  @Output() tileLoadEnd = new EventEmitter<TileSourceEvent>();
  @Output() tileLoadError = new EventEmitter<TileSourceEvent>();

  @ContentChild(TileGridWMTSComponent, { static: false }) tileGridWMTS: TileGridWMTSComponent;

  instance: SourceWMTS;

  protected readonly _instanceSignal = signal<SourceWMTS | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: SourceWMTS): SourceWMTS {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(@Host() layer: LayerTileComponent) {
    super(layer);
  }

  private lastTileGridInstance?: WMTS;

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    const requiresReload = Object.keys(changes).some((key) => !changes[key].firstChange);

    if (requiresReload && this.instance) {
      this.setLayerSource();
    }
  }

  setLayerSource(): void {
    this.setInstance(new SourceWMTS(this.createOptions()));
    this.instance.on('tileloadstart', (event: TileSourceEvent) => this.tileLoadStart.emit(event));
    this.instance.on('tileloadend', (event: TileSourceEvent) => this.tileLoadEnd.emit(event));
    this.instance.on('tileloaderror', (event: TileSourceEvent) => this.tileLoadError.emit(event));
    this.host.instance.setSource(this.instance);
    this.lastTileGridInstance = this.tileGridWMTS?.instance;
  }

  ngAfterContentInit(): void {
    if (this.tileGridWMTS || this.tileGrid()) {
      this.setLayerSource();
    }
  }

  ngAfterContentChecked() {
    const tileGrid = this.tileGridWMTS?.instance;

    if (tileGrid !== this.lastTileGridInstance && this.instance) {
      this.lastTileGridInstance = tileGrid;
      this.setLayerSource();
      return;
    }

    this.lastTileGridInstance = tileGrid;
  }

  private createOptions(): Options {
    return {
      attributions: this.attributions(),
      attributionsCollapsible: this.attributionsCollapsible(),
      cacheSize: this.cacheSize(),
      crossOrigin: this.crossOrigin(),
      interpolate: this.interpolate(),
      tileGrid: this.tileGridWMTS?.instance ?? this.tileGrid(),
      projection: this.projection(),
      reprojectionErrorThreshold: this.reprojectionErrorThreshold(),
      requestEncoding: this.requestEncoding(),
      layer: this.layer(),
      style: this.style(),
      tileClass: this.tileClass(),
      tilePixelRatio: this.tilePixelRatio(),
      format: this.format(),
      version: this.version(),
      matrixSet: this.matrixSet(),
      dimensions: this.dimensions(),
      url: this.url(),
      tileLoadFunction: this.tileLoadFunction(),
      urls: this.urls(),
      wrapX: this.wrapX(),
      transition: this.transition(),
      zDirection: this.zDirection(),
    };
  }
}
