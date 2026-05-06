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
  output,
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
  readonly cacheSize = input<number>();
  readonly crossOrigin = input<null | string>();
  readonly interpolate = input<boolean>();
  readonly tileGrid = input<WMTS>();
  readonly projection = input<ProjectionLike>();
  readonly reprojectionErrorThreshold = input<number>();
  readonly requestEncoding = input<RequestEncoding | undefined>();
  readonly layer = input.required<string>();
  readonly style = input.required<string>();
  readonly tileClass = input<any>();
  readonly tilePixelRatio = input<number>();
  readonly version = input<string>();
  readonly format = input<string>();
  readonly matrixSet = input.required<string>();
  readonly dimensions = input<any>();
  readonly url = input<string>();
  readonly tileLoadFunction = input<LoadFunction>();
  readonly urls = input<string[]>();
  readonly wrapX = input<boolean>();
  readonly transition = input<number>();
  readonly zDirection = input<number | NearestDirectionFunction>();
  readonly tileLoadStart = output<TileSourceEvent>();
  readonly tileLoadEnd = output<TileSourceEvent>();
  readonly tileLoadError = output<TileSourceEvent>();
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
