import {
  Component,
  forwardRef,
  AfterContentInit,
  contentChild,
  input,
  signal,
  inject,
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
export class SourceVectorTileComponent extends SourceComponent implements AfterContentInit {
  readonly cacheSize = input<number>();
  readonly extent = input<Extent>();
  readonly overlaps = input<boolean>();
  readonly projection = input<ProjectionLike>();
  readonly state = input<State>();
  readonly tileClass = input<typeof OlVectorTile>();
  readonly maxZoom = input<number>();
  readonly minZoom = input<number>();
  readonly tileSize = input<number | Size>();
  readonly maxResolution = input<number>();
  readonly tileUrlFunction = input<UrlFunction>();
  readonly tileLoadFunction = input<LoadFunction>();
  readonly url = input<string>();
  readonly urls = input<string[]>();
  readonly transition = input<number>();
  readonly wrapX = input<boolean>();
  readonly zDirection = input<number | NearestDirectionFunction>();
  readonly format = input<FeatureFormat<any>>();

  protected readonly formatMVTComponent = contentChild(FormatMVTComponent);
  protected readonly formatGeoJSONComponent = contentChild(FormatGeoJSONComponent);
  protected readonly tileGridComponent = contentChild(TileGridComponent);

  public instance: VectorTile;

  protected readonly _instanceSignal = signal<VectorTile | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: VectorTile): VectorTile {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  tileGrid: TileGrid;

  constructor() {
    super(inject(LayerVectorTileComponent, { host: true }));
  }

  ngAfterContentInit() {
    let format: FeatureFormat<any> | undefined = this.format();
    const formatMVTComponent = this.formatMVTComponent();
    const formatGeoJSONComponent = this.formatGeoJSONComponent();
    const tileGridComponent = this.tileGridComponent();

    if (formatMVTComponent) {
      format = formatMVTComponent.instance;
    }
    if (formatGeoJSONComponent) {
      format = formatGeoJSONComponent.instance;
    }
    if (tileGridComponent) {
      this.tileGrid = tileGridComponent.instance;
    }

    this.setInstance(new VectorTile(this.createOptions(format)));
    this.host.instance.setSource(this.instance);
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
