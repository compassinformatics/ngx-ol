import {
  Component,
  forwardRef,
  AfterContentInit,
  SimpleChanges,
  OnChanges,
  contentChild,
  input,
  output,
  signal,
  inject,
} from '@angular/core';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceComponent } from './source.component';
import { TileGridWMTSComponent } from '../tilegridwmts.component';
import SourceWMTS from 'ol/source/WMTS.js';
import WMTS from 'ol/tilegrid/WMTS.js';
import { ProjectionLike } from 'ol/proj.js';
import { LoadFunction } from 'ol/Tile.js';
import { TileSourceEvent } from 'ol/source/Tile.js';
import { Options, RequestEncoding } from 'ol/source/WMTS.js';
import { NearestDirectionFunction } from 'ol/array.js';

@Component({
  selector: 'aol-source-tilewmts',
  template: ` <ng-content></ng-content> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceTileWMTSComponent) }],
})
export class SourceTileWMTSComponent
  extends SourceComponent
  implements AfterContentInit, OnChanges
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
  constructor() {
    super(inject(LayerTileComponent, { host: true }));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.instance) {
      return;
    }
    super.ngOnChanges(changes);
    if (changes.hasOwnProperty('url') || this.hasRemovedDimensionKeys(changes)) {
      this.replaceInstance();
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

  private replaceInstance(): void {
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
      this.replaceInstance();
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
