import {
  signal,
  AfterContentInit,
  Component,
  ContentChild,
  EventEmitter,
  forwardRef,
  Host,
  OnChanges,
  Optional,
  Output,
  SimpleChanges,
  input,
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

  @ContentChild(TileGridComponent, { static: false }) tileGridXYZ: TileGridComponent;

  @Output() tileLoadStart = new EventEmitter<TileSourceEvent>();
  @Output() tileLoadEnd = new EventEmitter<TileSourceEvent>();
  @Output() tileLoadError = new EventEmitter<TileSourceEvent>();

  instance: XYZ;

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
    this.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    const requiresReload = Object.keys(changes).some((key) => !changes[key].firstChange);

    if (requiresReload && this.instance) {
      this.init();
    }
  }

  protected init() {
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
      tileGrid: this.tileGridXYZ?.instance ?? this.tileGrid(),
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
