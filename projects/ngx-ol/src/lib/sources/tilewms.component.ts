import {
  Component,
  OnChanges,
  OnInit,
  forwardRef,
  SimpleChanges,
  input,
  signal,
  inject,
} from '@angular/core';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceComponent } from './source.component';
import TileWMS from 'ol/source/TileWMS.js';
import { Options } from 'ol/source/TileWMS.js';
import TileGrid from 'ol/tilegrid/TileGrid.js';
import { LoadFunction } from 'ol/Tile.js';
import ImageTile from 'ol/ImageTile.js';
import { NearestDirectionFunction } from 'ol/array.js';
import { ProjectionLike } from 'ol/proj.js';
import { ServerType } from 'ol/source/wms.js';

@Component({
  selector: 'aol-source-tilewms',
  template: ` <ng-content></ng-content> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceTileWMSComponent) }],
})
export class SourceTileWMSComponent extends SourceComponent implements OnChanges, OnInit {
  readonly cacheSize = input<number>();
  readonly crossOrigin = input<null | string>();
  readonly gutter = input<number>();
  readonly hidpi = input<boolean>();
  readonly interpolate = input<boolean>();
  readonly params = input.required<{ [key: string]: any }>();
  readonly projection = input<ProjectionLike>();
  readonly reprojectionErrorThreshold = input<number>();
  readonly serverType = input<ServerType>();
  readonly tileClass = input<typeof ImageTile>();
  readonly tileGrid = input<TileGrid>();
  readonly tileLoadFunction = input<LoadFunction>();
  readonly url = input<string>();
  readonly urls = input<string[]>();
  readonly wrapX = input<boolean>();
  readonly transition = input<number>();
  readonly zDirection = input<number | NearestDirectionFunction>();

  instance: TileWMS;

  protected readonly _instanceSignal = signal<TileWMS | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: TileWMS): TileWMS {
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
      this.instance.updateParams(this.params());
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
      attributionsCollapsible: this.attributionsCollapsible(),
      cacheSize: this.cacheSize(),
      crossOrigin: this.crossOrigin(),
      gutter: this.gutter(),
      hidpi: this.hidpi(),
      interpolate: this.interpolate(),
      params: this.params(),
      projection: this.projection(),
      reprojectionErrorThreshold: this.reprojectionErrorThreshold(),
      serverType: this.serverType(),
      tileClass: this.tileClass(),
      tileGrid: this.tileGrid(),
      tileLoadFunction: this.tileLoadFunction(),
      url: this.url(),
      urls: this.urls(),
      wrapX: this.wrapX(),
      transition: this.transition(),
      zDirection: this.zDirection(),
    };
  }

  private replaceInstance(): void {
    this.setInstance(new TileWMS(this.createOptions()));
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
