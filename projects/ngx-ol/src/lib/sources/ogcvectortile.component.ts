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
import OGCVectorTile from 'ol/source/OGCVectorTile';
import { Options } from 'ol/source/OGCVectorTile';
import TileGrid from 'ol/tilegrid/TileGrid';
import { LayerVectorTileComponent } from '../layers/layervectortile.component';
import { SourceComponent } from './source.component';
import { ProjectionLike } from 'ol/proj';
import VectorTile from 'ol/VectorTile';
import { NearestDirectionFunction } from 'ol/array';
import { FormatMVTComponent } from '../formats/mvt.component';
import { FormatGeoJSONComponent } from '../formats/geojson.component';
import FeatureFormat from 'ol/format/Feature';

@Component({
  selector: 'aol-source-ogcvectortile',
  template: ` <ng-content></ng-content> `,
  providers: [
    { provide: SourceComponent, useExisting: forwardRef(() => SourceOGCVectorTileComponent) },
  ],
})
export class SourceOGCVectorTileComponent
  extends SourceComponent
  implements AfterContentInit, AfterContentChecked, OnChanges
{
  url = input.required<string>();
  context = input<any>();
  mediaType = input<string>();
  cacheSize = input<number>();
  overlaps = input<boolean>();
  projection = input<ProjectionLike>();
  tileClass = input<typeof VectorTile>();
  transition = input<number>();
  wrapX = input<boolean>();
  zDirection = input<number | NearestDirectionFunction>();
  collections = input<string[]>();
  format = input<FeatureFormat<any>>();
  @ContentChild(FormatMVTComponent, { static: false }) formatMVTComponent:
    | FormatMVTComponent
    | FormatGeoJSONComponent;
  @ContentChild(FormatGeoJSONComponent, { static: false })
  formatGeoJSONComponent: FormatGeoJSONComponent;
  instance: OGCVectorTile;
  protected readonly _instanceSignal = signal<OGCVectorTile | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: OGCVectorTile): OGCVectorTile {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }
  tileGrid: TileGrid;
  private lastFormatInstance?: FeatureFormat<any>;

  constructor(@Host() layer: LayerVectorTileComponent) {
    super(layer);
  }

  ngAfterContentInit() {
    this.init();
    this.lastFormatInstance = this.getFormatInstance();
  }

  ngAfterContentChecked() {
    const format = this.getFormatInstance();

    if (format !== this.lastFormatInstance && this.instance) {
      this.lastFormatInstance = format;
      this.init();
      return;
    }

    this.lastFormatInstance = format;
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

    this.setInstance(new OGCVectorTile(this.createOptions(format)));
    this.host.instance.setSource(this.instance);
    this.lastFormatInstance = format;
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

  private createOptions(format: FeatureFormat<any> | undefined): Options<any> {
    return {
      url: this.url(),
      context: this.context(),
      format,
      mediaType: this.mediaType(),
      attributions: this.attributions(),
      attributionsCollapsible: this.attributionsCollapsible(),
      cacheSize: this.cacheSize(),
      overlaps: this.overlaps(),
      projection: this.projection(),
      tileClass: this.tileClass(),
      transition: this.transition(),
      wrapX: this.wrapX(),
      zDirection: this.zDirection(),
      collections: this.collections(),
    };
  }
}
