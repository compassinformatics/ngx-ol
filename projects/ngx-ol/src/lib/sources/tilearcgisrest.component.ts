import {
  Component,
  forwardRef,
  OnChanges,
  OnInit,
  SimpleChanges,
  input,
  signal,
  inject,
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
  constructor() {
    super(inject(LayerTileComponent, { host: true }));
  }

  ngOnInit() {
    this.replaceInstance();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (!this.instance) {
      return;
    }

    if (this.hasRemovedParamKeys(changes)) {
      this.replaceInstance();
      return;
    }

    if (this.instance && changes.hasOwnProperty('params')) {
      this.instance.updateParams(this.params() ?? {});
    }
    if (this.instance && changes.tileLoadFunction?.currentValue) {
      this.instance.setTileLoadFunction(changes.tileLoadFunction.currentValue);
    }
    if (this.instance && changes.url?.currentValue) {
      this.instance.setUrl(changes.url.currentValue);
    }
    if (this.instance && changes.urls?.currentValue) {
      this.instance.setUrls(changes.urls.currentValue);
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

  private replaceInstance(): void {
    this.setInstance(new TileArcGISRest(this.createOptions()));
    this.host.instance.setSource(this.instance);
  }

  private hasRemovedParamKeys(changes: SimpleChanges): boolean {
    if (!changes.params || changes.params.firstChange) {
      return false;
    }

    const previousParams = changes.params.previousValue ?? {};
    const nextParams = changes.params.currentValue ?? {};

    return Object.keys(previousParams).some(
      (key) => !Object.prototype.hasOwnProperty.call(nextParams, key),
    );
  }
}
