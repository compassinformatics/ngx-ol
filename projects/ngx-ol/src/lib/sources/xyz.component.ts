import {
  AfterContentInit,
  Component,
  forwardRef,
  Host,
  OnChanges,
  Optional,
  SimpleChanges,
  contentChild,
  input,
  output,
  signal,
} from '@angular/core';
import { Size } from 'ol/size';
import XYZ from 'ol/source/XYZ';
import { Options } from 'ol/source/XYZ';
import { TileSourceEvent } from 'ol/source/Tile';
import { LoadFunction, UrlFunction } from 'ol/Tile';
import TileGrid from 'ol/tilegrid/TileGrid';
import { ProjectionLike } from 'ol/proj';
import { NearestDirectionFunction } from 'ol/array';

import { LayerTileComponent } from '../layers/layertile.component';
import { TileGridComponent } from '../tilegrid.component';
import { SourceComponent } from './source.component';

@Component({
  selector: 'aol-source-xyz',
  template: ` <ng-content></ng-content> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceXYZComponent) }],
})
export class SourceXYZComponent extends SourceComponent implements AfterContentInit, OnChanges {
  cacheSize = input<number>();
  crossOrigin = input<null | string>();
  gutter = input<number>();
  interpolate = input<boolean>();
  projection = input<ProjectionLike>();
  reprojectionErrorThreshold = input<number>();
  maxResolution = input<number>();
  minZoom = input<number>();
  maxZoom = input<number>();
  tileGrid = input<TileGrid>();
  tileLoadFunction = input<LoadFunction>();
  tilePixelRatio = input<number>();
  tileSize = input<number | Size>();
  tileUrlFunction = input<UrlFunction>();
  transition = input<number>();
  url = input<string>();
  urls = input<string[]>();
  wrapX = input<boolean>();
  zDirection = input<number | NearestDirectionFunction>();

  protected readonly tileGridXYZ = contentChild(TileGridComponent);

  tileLoadStart = output<TileSourceEvent>();
  tileLoadEnd = output<TileSourceEvent>();
  tileLoadError = output<TileSourceEvent>();

  instance: XYZ;
  protected contentTileGrid?: TileGrid;

  protected readonly _instanceSignal = signal<XYZ | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: XYZ): XYZ {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  constructor(
    @Optional()
    @Host()
    protected layer?: LayerTileComponent,
  ) {
    super(layer!);
  }

  ngAfterContentInit() {
    const tileGridXYZ = this.tileGridXYZ();

    if (tileGridXYZ) {
      this.contentTileGrid = tileGridXYZ.instance;
    }
    this.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.instance) {
      return;
    }
    super.ngOnChanges(changes);
    for (const key in changes) {
      if (changes.hasOwnProperty(key)) {
        switch (key) {
          case 'tileLoadFunction':
            if (changes[key].currentValue) {
              this.instance.setTileLoadFunction(changes[key].currentValue);
            }
            continue;
          case 'tileUrlFunction':
            if (changes[key].currentValue) {
              this.instance.setTileUrlFunction(changes[key].currentValue);
            }
            continue;
          case 'urls':
            if (changes[key].currentValue) {
              this.instance.setUrls(changes[key].currentValue);
            }
            continue;
          case 'url':
            if (changes[key].currentValue !== undefined) {
              this.instance.setUrl(changes[key].currentValue);
              continue;
            }
            break;
          default:
            break;
        }
      }
    }
  }

  init() {
    this.setInstance(new XYZ(this.createOptions()));

    this.instance.on('tileloadstart', (event: TileSourceEvent) => this.tileLoadStart.emit(event));
    this.instance.on('tileloadend', (event: TileSourceEvent) => this.tileLoadEnd.emit(event));
    this.instance.on('tileloaderror', (event: TileSourceEvent) => this.tileLoadError.emit(event));

    this.register(this.instance);
  }

  protected createOptions(): Options {
    return {
      attributions: this.attributions(),
      attributionsCollapsible: this.attributionsCollapsible(),
      cacheSize: this.cacheSize(),
      crossOrigin: this.crossOrigin(),
      gutter: this.gutter(),
      interpolate: this.interpolate(),
      projection: this.projection(),
      reprojectionErrorThreshold: this.reprojectionErrorThreshold(),
      maxResolution: this.maxResolution(),
      minZoom: this.minZoom(),
      maxZoom: this.maxZoom(),
      tileGrid: this.contentTileGrid ?? this.tileGrid(),
      tileLoadFunction: this.tileLoadFunction(),
      tilePixelRatio: this.tilePixelRatio(),
      tileSize: this.tileSize(),
      tileUrlFunction: this.tileUrlFunction(),
      transition: this.transition(),
      url: this.url(),
      urls: this.urls(),
      wrapX: this.wrapX(),
      zDirection: this.zDirection(),
    };
  }
}
