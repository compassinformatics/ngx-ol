import {
  Component,
  Host,
  forwardRef,
  AfterContentInit,
  SimpleChanges,
  OnChanges,
  contentChild,
  input,
  output,
  signal,
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

  tileLoadStart = output<TileSourceEvent>();
  tileLoadEnd = output<TileSourceEvent>();
  tileLoadError = output<TileSourceEvent>();

  protected readonly tileGridWMTS = contentChild(TileGridWMTSComponent);

  instance: SourceWMTS;
  private contentTileGrid?: WMTS;

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

  ngOnChanges(changes: SimpleChanges) {
    if (!this.instance) {
      return;
    }
    super.ngOnChanges(changes);
    if (changes.hasOwnProperty('url') || this.hasRemovedDimensionKeys(changes)) {
      this.setLayerSource();
      return;
    }
    if (changes.hasOwnProperty('dimensions')) {
      this.instance.updateDimensions(changes.dimensions.currentValue ?? {});
    }
  }

  private hasRemovedDimensionKeys(changes: SimpleChanges): boolean {
    if (!changes.dimensions || changes.dimensions.firstChange) {
      return false;
    }

    const previousDimensions = changes.dimensions.previousValue ?? {};
    const nextDimensions = changes.dimensions.currentValue ?? {};

    return Object.keys(previousDimensions).some(
      (key) => !Object.prototype.hasOwnProperty.call(nextDimensions, key),
    );
  }

  setLayerSource(): void {
    this.setInstance(new SourceWMTS(this.createOptions()));
    this.instance.on('tileloadstart', (event: TileSourceEvent) => this.tileLoadStart.emit(event));
    this.instance.on('tileloadend', (event: TileSourceEvent) => this.tileLoadEnd.emit(event));
    this.instance.on('tileloaderror', (event: TileSourceEvent) => this.tileLoadError.emit(event));
    this.host.instance.setSource(this.instance);
  }

  ngAfterContentInit(): void {
    const tileGridWMTS = this.tileGridWMTS();

    if (tileGridWMTS) {
      this.contentTileGrid = tileGridWMTS.instance;
    }
    if (this.contentTileGrid ?? this.tileGrid()) {
      this.setLayerSource();
    }
  }

  private createOptions(): Options {
    return {
      attributions: this.attributions(),
      attributionsCollapsible: this.attributionsCollapsible(),
      cacheSize: this.cacheSize(),
      crossOrigin: this.crossOrigin(),
      interpolate: this.interpolate(),
      tileGrid: (this.contentTileGrid ?? this.tileGrid())!,
      projection: this.projection(),
      reprojectionErrorThreshold: this.reprojectionErrorThreshold(),
      requestEncoding: this.requestEncoding(),
      layer: this.layer(),
      style: this.style(),
      tileClass: this.tileClass(),
      tilePixelRatio: this.tilePixelRatio(),
      version: this.version(),
      format: this.format(),
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
