import {
  Component,
  Host,
  forwardRef,
  ContentChild,
  AfterContentInit,
  AfterContentChecked,
  OnChanges,
  SimpleChanges,
  signal,
  input,
} from '@angular/core';
import VectorTile from 'ol/source/VectorTile';
import { Options } from 'ol/source/VectorTile';
import TileGrid from 'ol/tilegrid/TileGrid';
import OlVectorTile from 'ol/VectorTile';
import { LayerVectorTileComponent } from '../layers/layervectortile.component';
import { TileGridComponent } from '../tilegrid.component';
import { SourceComponent } from './source.component';
import { ProjectionLike } from 'ol/proj';
import { LoadFunction, UrlFunction } from 'ol/Tile';
import { NearestDirectionFunction } from 'ol/array';
import { Extent } from 'ol/extent';
import { Size } from 'ol/size';
import { State } from 'ol/source/Source';
import { FormatGeoJSONComponent } from '../formats/geojson.component';
import { FormatMVTComponent } from '../formats/mvt.component';
import FeatureFormat from 'ol/format/Feature';

@Component({
  selector: 'aol-source-vectortile',
  template: ` <ng-content></ng-content> `,
  providers: [
    { provide: SourceComponent, useExisting: forwardRef(() => SourceVectorTileComponent) },
  ],
})
export class SourceVectorTileComponent
  extends SourceComponent
  implements AfterContentInit, AfterContentChecked, OnChanges
{
  cacheSize = input<number>();
  extent = input<Extent>();
  overlaps = input<boolean>();
  projection = input<ProjectionLike>();
  state = input<State>();
  tileClass = input<typeof OlVectorTile>();
  maxZoom = input<number>();
  minZoom = input<number>();
  tileSize = input<number | Size>();
  maxResolution = input<number>();
  tileUrlFunction = input<UrlFunction>();
  tileLoadFunction = input<LoadFunction>();
  url = input<string>();
  urls = input<string[]>();
  transition = input<number>();
  wrapX = input<boolean>();
  zDirection = input<number | NearestDirectionFunction>();
  format = input<FeatureFormat<any>>();
  @ContentChild(FormatMVTComponent, { static: false }) formatMVTComponent: FormatMVTComponent;
  @ContentChild(FormatGeoJSONComponent, { static: false })
  formatGeoJSONComponent: FormatGeoJSONComponent;
  @ContentChild(TileGridComponent, { static: false }) tileGridComponent: TileGridComponent;
  instance: VectorTile;
  protected readonly _instanceSignal = signal<VectorTile | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: VectorTile): VectorTile {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }
  tileGrid: TileGrid;
  private lastFormatInstance?: FeatureFormat<any>;
  private lastTileGridInstance?: TileGrid;

  constructor(@Host() layer: LayerVectorTileComponent) {
    super(layer);
  }

  ngAfterContentInit() {
    this.init();
    this.syncChildInstances();
  }

  ngAfterContentChecked() {
    const format = this.getFormatInstance();
    const tileGrid = this.tileGridComponent?.instance;
    const childChanged =
      format !== this.lastFormatInstance || tileGrid !== this.lastTileGridInstance;

    this.syncChildInstances(format, tileGrid);

    if (childChanged && this.instance) {
      this.init();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    const requiresReload = Object.keys(changes).some((key) => !changes[key].firstChange);

    if (requiresReload && this.instance) {
      this.init();
    }
  }

  private init() {
    const format = this.getFormatInstance();
    this.tileGrid = this.tileGridComponent?.instance;

    this.setInstance(new VectorTile(this.createOptions(format)));
    this.host.instance.setSource(this.instance);
    this.syncChildInstances(format, this.tileGrid);
  }

  private getFormatInstance(): FeatureFormat<any> | undefined {
    if (this.formatGeoJSONComponent) {
      return this.formatGeoJSONComponent.instance;
    }

    if (this.formatMVTComponent) {
      return this.formatMVTComponent.instance;
    }

    return this.format();
  }

  private syncChildInstances(format = this.getFormatInstance(), tileGrid = this.tileGridComponent?.instance) {
    this.lastFormatInstance = format;
    this.lastTileGridInstance = tileGrid;
  }

  private createOptions(format: FeatureFormat<any> | undefined): Options<any> {
    return {
      attributions: this.attributions(),
      cacheSize: this.cacheSize(),
      extent: this.extent(),
      format,
      overlaps: this.overlaps(),
      projection: this.projection(),
      state: this.state(),
      tileClass: this.tileClass(),
      maxZoom: this.maxZoom(),
      minZoom: this.minZoom(),
      tileSize: this.tileSize(),
      maxResolution: this.maxResolution(),
      tileGrid: this.tileGrid,
      tileUrlFunction: this.tileUrlFunction(),
      tileLoadFunction: this.tileLoadFunction(),
      url: this.url(),
      urls: this.urls(),
      transition: this.transition(),
      wrapX: this.wrapX(),
      zDirection: this.zDirection(),
    };
  }
}
