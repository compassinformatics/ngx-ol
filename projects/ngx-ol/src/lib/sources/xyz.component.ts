import {
  AfterContentInit,
  Component,
  forwardRef,
  OnChanges,
  SimpleChanges,
  contentChild,
  input,
  output,
  signal,
  inject,
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
  readonly cacheSize = input<number>();
  readonly crossOrigin = input<null | string>();
  readonly gutter = input<number>();
  readonly interpolate = input<boolean>();
  readonly projection = input<ProjectionLike>();
  readonly reprojectionErrorThreshold = input<number>();
  readonly maxResolution = input<number>();
  readonly minZoom = input<number>();
  readonly maxZoom = input<number>();
  readonly tileGrid = input<TileGrid>();
  readonly tileLoadFunction = input<LoadFunction>();
  readonly tilePixelRatio = input<number>();
  readonly tileSize = input<number | Size>();
  readonly tileUrlFunction = input<UrlFunction>();
  readonly transition = input<number>();
  readonly url = input<string>();
  readonly urls = input<string[]>();
  readonly wrapX = input<boolean>();
  readonly zDirection = input<number | NearestDirectionFunction>();

  protected readonly tileGridXYZ = contentChild(TileGridComponent);

  readonly tileLoadStart = output<TileSourceEvent>();
  readonly tileLoadEnd = output<TileSourceEvent>();
  readonly tileLoadError = output<TileSourceEvent>();

  instance: XYZ;
  protected contentTileGrid?: TileGrid;

  protected readonly _instanceSignal = signal<XYZ | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: XYZ): XYZ {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  constructor() {
    super(inject(LayerTileComponent, { optional: true, host: true })!);
  }

  ngAfterContentInit() {
    const tileGridXYZ = this.tileGridXYZ();

    if (tileGridXYZ) {
      this.contentTileGrid = tileGridXYZ.instance;
    }
    this.initializeInstance();
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

  initializeInstance() {
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
