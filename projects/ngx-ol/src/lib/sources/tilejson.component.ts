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
  readonly cacheSize = input<number>();
  readonly crossOrigin = input<string | null>();
  readonly interpolate = input<boolean>();
  readonly jsonp = input<boolean>();
  readonly reprojectionErrorThreshold = input<number>();
  readonly tileJSON = input<Config>();
  readonly tileLoadFunction = input<LoadFunction>();
  readonly tileSize = input<number | Size>();
  readonly url = input<string>();
  readonly wrapX = input<boolean>();
  readonly transition = input<number>();
  readonly zDirection = input<number | NearestDirectionFunction>();
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
    this.setInstance(new TileJSON(this.createOptions()));
    this.host.instance.setSource(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    const requiresReload = Object.keys(changes).some((key) => !changes[key].firstChange);

    if (requiresReload && this.instance) {
      this.reloadInstance();
    }
  }

  private reloadInstance() {
    this.setInstance(new TileJSON(this.createOptions()));
    this.host.instance.setSource(this.instance);
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
