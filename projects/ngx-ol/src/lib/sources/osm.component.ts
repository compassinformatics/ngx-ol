import {
  signal,
  AfterContentInit,
  Component,
  forwardRef,
  Host,
  Optional,
  output,
  input,
} from '@angular/core';
import OSM from 'ol/source/OSM';
import { Options } from 'ol/source/OSM';
import { TileSourceEvent } from 'ol/source/Tile';
import { LoadFunction } from 'ol/Tile';
import { NearestDirectionFunction } from 'ol/array';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceComponent } from './source.component';
import { SourceXYZComponent } from './xyz.component';

@Component({
  selector: 'aol-source-osm',
  template: ` <div class="aol-source-osm"></div> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceOsmComponent) }],
})
export class SourceOsmComponent extends SourceXYZComponent implements AfterContentInit {
  readonly cacheSize = input<number>();
  readonly crossOrigin = input<string | null>();
  readonly interpolate = input<boolean>();
  readonly maxZoom = input<number>();
  readonly reprojectionErrorThreshold = input<number>();
  readonly tileLoadFunction = input<LoadFunction>();
  readonly transition = input<number>();
  readonly url = input<string>();
  readonly wrapX = input<boolean>();
  readonly zDirection = input<number | NearestDirectionFunction>();
  readonly tileLoadStart = output<TileSourceEvent>();
  readonly tileLoadEnd = output<TileSourceEvent>();
  readonly tileLoadError = output<TileSourceEvent>();
  instance: OSM;
  protected readonly _instanceSignal = signal<OSM | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: OSM): OSM {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(
    @Optional()
    @Host()
    protected readonly layer?: LayerTileComponent,
  ) {
    super(layer);
  }

  ngAfterContentInit() {
    this.init();
  }

  protected override init() {
    this.setInstance(new OSM(this.createOptions()));
    this.instance.on('tileloadstart', (event: TileSourceEvent) => this.tileLoadStart.emit(event));
    this.instance.on('tileloadend', (event: TileSourceEvent) => this.tileLoadEnd.emit(event));
    this.instance.on('tileloaderror', (event: TileSourceEvent) => this.tileLoadError.emit(event));
    this.register(this.instance);
  }

  protected override createOptions(): Options {
    return {
      attributions: this.attributions(),
      cacheSize: this.cacheSize(),
      crossOrigin: this.crossOrigin(),
      interpolate: this.interpolate(),
      maxZoom: this.maxZoom(),
      reprojectionErrorThreshold: this.reprojectionErrorThreshold(),
      tileLoadFunction: this.tileLoadFunction(),
      transition: this.transition(),
      url: this.url(),
      wrapX: this.wrapX(),
      zDirection: this.zDirection(),
    };
  }
}
