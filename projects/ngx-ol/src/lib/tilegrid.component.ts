import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
  @Input()
  extent?: Extent;
  @Input()
  maxZoom: number;
  @Input()
  minZoom?: number;
  @Input()
  maxResolution: number;
  @Input()
  tileSize?: number | Size;
  @Input()
  origin?: Coordinate;
  @Input()
  origins?: Coordinate[];
  @Input()
  resolutions: number[];
  @Input()
  sizes?: Size[];
  @Input()
  tileSizes?: (number | Size)[];

  instance: TileGrid;

  ngOnInit() {
    this.createInstance();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.createInstance();
  }

  protected createInstance() {
    if (!this.resolutions) {
      this.instance = createXYZ(this.createXYZOptions());
    } else {
      this.instance = new TileGrid(this.createTileGridOptions());
    }
  }

  private createXYZOptions(): XYZOptions {
    return {
      extent: this.extent,
      maxResolution: this.maxResolution,
      maxZoom: this.maxZoom,
      minZoom: this.minZoom,
      tileSize: this.tileSize,
    };
  }

  private createTileGridOptions(): Options {
    return {
      extent: this.extent,
      minZoom: this.minZoom,
      origin: this.origin,
      origins: this.origins,
      resolutions: this.resolutions,
      sizes: this.sizes,
      tileSize: this.tileSize,
      tileSizes: this.tileSizes,
    };
  }
}
