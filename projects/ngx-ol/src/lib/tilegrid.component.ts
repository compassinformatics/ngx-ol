import { Component, OnChanges, OnInit, SimpleChanges, signal, input } from '@angular/core';
import { createXYZ, XYZOptions } from 'ol/tilegrid';
import TileGrid, { Options } from 'ol/tilegrid/TileGrid';
import { Extent } from 'ol/extent';
import { Coordinate } from 'ol/coordinate';
import { Size } from 'ol/size';

@Component({
  selector: 'aol-tilegrid',
  template: '',
})
export class TileGridComponent implements OnInit, OnChanges {
  extent = input<Extent>();
  maxZoom = input<number>();
  minZoom = input<number>();
  maxResolution = input<number>();
  tileSize = input<number | Size>();
  origin = input<Coordinate>();
  origins = input<Coordinate[]>();
  resolutions = input<number[]>();
  sizes = input<Size[]>();
  tileSizes = input<(number | Size)[]>();
  instance: TileGrid;
  protected readonly _instanceSignal = signal<TileGrid | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: TileGrid): TileGrid {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  ngOnInit() {
    this.createInstance();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.createInstance();
  }

  protected createInstance() {
    if (!this.resolutions()) {
      this.setInstance(createXYZ(this.createXYZOptions()));
    } else {
      this.setInstance(new TileGrid(this.createTileGridOptions()));
    }
  }

  private createXYZOptions(): XYZOptions {
    return {
      extent: this.extent(),
      maxResolution: this.maxResolution(),
      maxZoom: this.maxZoom(),
      minZoom: this.minZoom(),
      tileSize: this.tileSize(),
    };
  }

  private createTileGridOptions(): Options {
    return {
      extent: this.extent(),
      minZoom: this.minZoom(),
      origin: this.origin(),
      origins: this.origins(),
      resolutions: this.resolutions()!,
      sizes: this.sizes(),
      tileSize: this.tileSize(),
      tileSizes: this.tileSizes(),
    };
  }
}
