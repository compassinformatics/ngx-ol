import {
  Component,
  Host,
  OnChanges,
  OnInit,
  SimpleChanges,
  forwardRef,
  signal,
  input,
} from '@angular/core';
import TileJSON from 'ol/source/TileJSON';
import { Config, Options } from 'ol/source/TileJSON';
import { LoadFunction } from 'ol/Tile';
import { Size } from 'ol/size';
import { NearestDirectionFunction } from 'ol/array';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceComponent } from './source.component';

@Component({
  selector: 'aol-source-tilejson',
  template: ` <ng-content></ng-content> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceTileJSONComponent) }],
})
export class SourceTileJSONComponent extends SourceComponent implements OnInit, OnChanges {
  cacheSize = input<number>();
  crossOrigin = input<string | null>();
  interpolate = input<boolean>();
  jsonp = input<boolean>();
  reprojectionErrorThreshold = input<number>();
  tileJSON = input<Config>();
  tileLoadFunction = input<LoadFunction>();
  tileSize = input<number | Size>();
  url = input<string>();
  wrapX = input<boolean>();
  transition = input<number>();
  zDirection = input<number | NearestDirectionFunction>();
  instance: TileJSON;
  protected readonly _instanceSignal = signal<TileJSON | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: TileJSON): TileJSON {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(@Host() layer: LayerTileComponent) {
    super(layer);
  }

  ngOnInit() {
    this.setLayerSource();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    const requiresReload = this.hasReloadableChanges(changes);

    if (requiresReload && this.instance) {
      this.reloadInstance();
    }
  }

  private reloadInstance() {
    this.host.instance.setSource(null);
    this.setLayerSource();
  }

  private setLayerSource() {
    this.setInstance(new TileJSON(this.createOptions()));
    this.setSourceKey();
    this.host.instance.setSource(this.instance);
    this.instance.changed();
    this.host.instance.changed();
  }

  private setSourceKey() {
    const key = this.url() ?? JSON.stringify(this.tileJSON());

    if (key) {
      (this.instance as unknown as { setKey(key: string): void }).setKey(key);
    }
  }

  private createOptions(): Options {
    return {
      attributions: this.attributions(),
      cacheSize: this.cacheSize(),
      crossOrigin: this.crossOrigin(),
      interpolate: this.interpolate(),
      jsonp: this.jsonp(),
      reprojectionErrorThreshold: this.reprojectionErrorThreshold(),
      tileJSON: this.tileJSON(),
      tileLoadFunction: this.tileLoadFunction(),
      tileSize: this.tileSize(),
      url: this.url(),
      wrapX: this.wrapX(),
      transition: this.transition(),
      zDirection: this.zDirection(),
    };
  }
}
