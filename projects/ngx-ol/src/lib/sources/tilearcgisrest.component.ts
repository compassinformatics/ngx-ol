import {
  signal,
  Component,
  forwardRef,
  Host,
  OnChanges,
  OnInit,
  SimpleChanges,
  input,
} from '@angular/core';
import type { NearestDirectionFunction } from 'ol/array';
import type { ProjectionLike } from 'ol/proj';
import TileGrid from 'ol/tilegrid/TileGrid';
import type { LoadFunction } from 'ol/Tile';
import TileArcGISRest from 'ol/source/TileArcGISRest';
import type { Options } from 'ol/source/TileArcGISRest';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceComponent } from './source.component';

@Component({
  selector: 'aol-source-tilearcgisrest',
  template: ` <ng-content></ng-content> `,
  providers: [
    { provide: SourceComponent, useExisting: forwardRef(() => SourceTileArcGISRestComponent) },
  ],
})
export class SourceTileArcGISRestComponent extends SourceComponent implements OnInit, OnChanges {
  readonly cacheSize = input<number>();
  readonly crossOrigin = input<string | null>();
  readonly interpolate = input<boolean>();
  readonly params = input<{ [key: string]: any }>();
  readonly hidpi = input<boolean>();
  readonly tileGrid = input<TileGrid>();
  readonly projection = input<ProjectionLike>();
  readonly reprojectionErrorThreshold = input<number>();
  readonly tileLoadFunction = input<LoadFunction>();
  readonly url = input<string>();
  readonly wrapX = input<boolean>();
  readonly transition = input<number>();
  readonly urls = input<string[]>();
  readonly zDirection = input<number | NearestDirectionFunction>();
  instance: TileArcGISRest;
  protected readonly _instanceSignal = signal<TileArcGISRest | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: TileArcGISRest): TileArcGISRest {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(@Host() layer: LayerTileComponent) {
    super(layer);
  }

  ngOnInit() {
    this.setInstance(new TileArcGISRest(this.createOptions()));
    this.host.instance.setSource(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (this.instance && changes.hasOwnProperty('params') && this.params()) {
      this.instance.updateParams(this.params());
    }
  }

  private createOptions(): Options {
    return {
      attributions: this.attributions(),
      cacheSize: this.cacheSize(),
      crossOrigin: this.crossOrigin(),
      interpolate: this.interpolate(),
      params: this.params(),
      hidpi: this.hidpi(),
      tileGrid: this.tileGrid(),
      projection: this.projection(),
      reprojectionErrorThreshold: this.reprojectionErrorThreshold(),
      tileLoadFunction: this.tileLoadFunction(),
      url: this.url(),
      wrapX: this.wrapX(),
      transition: this.transition(),
      urls: this.urls(),
      zDirection: this.zDirection(),
    };
  }
}
