import {
  Component,
  forwardRef,
  AfterContentInit,
  contentChild,
  input,
  signal,
  inject,
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
export class SourceOGCVectorTileComponent extends SourceComponent implements AfterContentInit {
  readonly url = input.required<string>();
  readonly context = input<any>();
  readonly mediaType = input<string>();
  readonly cacheSize = input<number>();
  readonly overlaps = input<boolean>();
  readonly projection = input<ProjectionLike>();
  readonly tileClass = input<typeof VectorTile>();
  readonly transition = input<number>();
  readonly wrapX = input<boolean>();
  readonly zDirection = input<number | NearestDirectionFunction>();
  readonly collections = input<string[]>();
  readonly format = input<FeatureFormat<any>>();

  protected readonly formatMVTComponent = contentChild(FormatMVTComponent);
  protected readonly formatGeoJSONComponent = contentChild(FormatGeoJSONComponent);

  public instance: OGCVectorTile;

  protected readonly _instanceSignal = signal<OGCVectorTile | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: OGCVectorTile): OGCVectorTile {
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

    if (formatMVTComponent) {
      format = formatMVTComponent.instance;
    }
    if (formatGeoJSONComponent) {
      format = formatGeoJSONComponent.instance;
    }

    this.setInstance(new OGCVectorTile(this.createOptions(format)));
    this.host.instance.setSource(this.instance);
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
