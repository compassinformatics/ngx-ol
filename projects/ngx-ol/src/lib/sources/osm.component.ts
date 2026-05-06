import {
  signal,
  AfterContentInit,
  Component,
  EventEmitter,
  forwardRef,
  Host,
  Optional,
  Output,
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
  cacheSize = input<number>();
  crossOrigin = input<string | null>();
  interpolate = input<boolean>();
  maxZoom = input<number>();
  reprojectionErrorThreshold = input<number>();
  tileLoadFunction = input<LoadFunction>();
  transition = input<number>();
  url = input<string>();
  wrapX = input<boolean>();
  zDirection = input<number | NearestDirectionFunction>();

  @Output() tileLoadStart = new EventEmitter<TileSourceEvent>();
  @Output() tileLoadEnd = new EventEmitter<TileSourceEvent>();
  @Output() tileLoadError = new EventEmitter<TileSourceEvent>();

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
    protected layer?: LayerTileComponent,
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
