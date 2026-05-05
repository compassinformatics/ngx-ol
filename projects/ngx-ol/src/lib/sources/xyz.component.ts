import {
  signal,
  AfterContentInit,
  Component,
  ContentChild,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  OnChanges,
  Optional,
  Output,
  SimpleChanges,
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
  @Input() cacheSize?: number;
  @Input() crossOrigin?: null | string;
  @Input() gutter?: number;
  @Input() interpolate?: boolean;
  @Input() projection?: ProjectionLike;
  @Input() reprojectionErrorThreshold?: number;
  @Input() maxResolution?: number;
  @Input() minZoom?: number;
  @Input() maxZoom?: number;
  @Input() tileGrid?: TileGrid;
  @Input() tileLoadFunction?: LoadFunction;
  @Input() tilePixelRatio?: number;
  @Input() tileSize?: number | Size;
  @Input() tileUrlFunction?: UrlFunction;
  @Input() transition?: number;
  @Input() url?: string;
  @Input() urls?: string[];
  @Input() wrapX?: boolean;
  @Input() zDirection?: number | NearestDirectionFunction;

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
    if (this.tileGridXYZ) {
      this.tileGrid = this.tileGridXYZ.instance;
    }
    this.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    const properties: { [index: string]: any } = {};

    if (!this.instance) {
      return;
    }
    for (const key in changes) {
      if (changes.hasOwnProperty(key)) {
        properties[key] = changes[key].currentValue;
      }
    }

    this.instance.setProperties(properties, false);
    if (changes.hasOwnProperty('url')) {
      this.init();
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
      attributions: this.attributions,
      attributionsCollapsible: this.attributionsCollapsible,
      cacheSize: this.cacheSize,
      crossOrigin: this.crossOrigin,
      gutter: this.gutter,
      interpolate: this.interpolate,
      projection: this.projection,
      reprojectionErrorThreshold: this.reprojectionErrorThreshold,
      maxResolution: this.maxResolution,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      tileGrid: this.tileGrid,
      tileLoadFunction: this.tileLoadFunction,
      tilePixelRatio: this.tilePixelRatio,
      tileSize: this.tileSize,
      tileUrlFunction: this.tileUrlFunction,
      transition: this.transition,
      url: this.url,
      urls: this.urls,
      wrapX: this.wrapX,
      zDirection: this.zDirection,
    };
  }
}
