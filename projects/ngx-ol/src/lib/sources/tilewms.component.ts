import {
  signal,
  Component,
  Host,
  OnChanges,
  OnInit,
  forwardRef,
  SimpleChanges,
  input,
} from '@angular/core';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceComponent } from './source.component';
import TileWMS from 'ol/source/TileWMS';
import { Options } from 'ol/source/TileWMS';
import TileGrid from 'ol/tilegrid/TileGrid';
import { LoadFunction } from 'ol/Tile';
import ImageTile from 'ol/ImageTile';
import { NearestDirectionFunction } from 'ol/array';
import { ProjectionLike } from 'ol/proj';
import { ServerType } from 'ol/source/wms';

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

  constructor(@Host() layer: LayerTileComponent) {
    super(layer);
  }

  ngOnInit() {
    this.setInstance(new TileWMS(this.createOptions()));
    this.host.instance.setSource(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (this.instance && changes.hasOwnProperty('params')) {
      this.instance.updateParams(this.params());
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
}
