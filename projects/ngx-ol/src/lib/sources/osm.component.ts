import {
  AfterContentInit,
  Component,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  Optional,
  Output,
} from '@angular/core';
import { OSM } from 'ol/source';
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
  @Input()
  cacheSize: number;
  @Input()
  crossOrigin: string;
  @Input()
  interpolate: boolean;
  @Input()
  maxZoom: number;
  @Input()
  reprojectionErrorThreshold: number;
  @Input()
  tileLoadFunction?: LoadFunction;
  @Input()
  transition: number;
  @Input()
  url: string;
  @Input()
  wrapX: boolean;
  @Input()
  zDirection: number | NearestDirectionFunction;

  @Output()
  tileLoadStart = new EventEmitter<TileSourceEvent>();
  @Output()
  tileLoadEnd = new EventEmitter<TileSourceEvent>();
  @Output()
  tileLoadError = new EventEmitter<TileSourceEvent>();

  instance: OSM;

  constructor(
    @Optional()
    @Host()
    protected layer?: LayerTileComponent,
  ) {
    super(layer);
  }

  ngAfterContentInit() {
    if (this.tileGridXYZ) {
      this.tileGrid = this.tileGridXYZ.instance;
    }
    this.instance = new OSM(this.createOptions());
    this.instance.on('tileloadstart', (event: TileSourceEvent) => this.tileLoadStart.emit(event));
    this.instance.on('tileloadend', (event: TileSourceEvent) => this.tileLoadEnd.emit(event));
    this.instance.on('tileloaderror', (event: TileSourceEvent) => this.tileLoadError.emit(event));
    this.register(this.instance);
  }

  protected override createOptions(): Options {
    return {
      attributions: this.attributions,
      cacheSize: this.cacheSize,
      crossOrigin: this.crossOrigin,
      interpolate: this.interpolate,
      maxZoom: this.maxZoom,
      reprojectionErrorThreshold: this.reprojectionErrorThreshold,
      tileLoadFunction: this.tileLoadFunction,
      transition: this.transition,
      url: this.url,
      wrapX: this.wrapX,
      zDirection: this.zDirection,
    };
  }
}
