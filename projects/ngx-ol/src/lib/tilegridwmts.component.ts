import { Component, OnChanges, OnInit, input, signal } from '@angular/core';
import WMTS, { Options } from 'ol/tilegrid/WMTS.js';
import { TileGridComponent } from './tilegrid.component';
import { Coordinate } from 'ol/coordinate.js';
import { Size } from 'ol/size.js';

@Component({
  selector: 'aol-tilegrid-wmts',
  template: '',
})
export class TileGridWMTSComponent extends TileGridComponent implements OnInit, OnChanges {
  readonly origin = input<Coordinate>();
  readonly origins = input<Coordinate[]>();
  readonly resolutions = input<number[]>();
  readonly matrixIds = input.required<string[]>();
  readonly sizes = input<Size[]>();
  readonly tileSize = input<number | Size>();
  readonly tileSizes = input<(number | Size)[]>();

  instance: WMTS;

  protected readonly _instanceSignal = signal<WMTS | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: WMTS): WMTS {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  ngOnInit() {
    this.setInstance(new WMTS(this.createOptions()));
  }

  ngOnChanges() {
    this.setInstance(new WMTS(this.createOptions()));
  }

  private createOptions(): Options {
    return {
      extent: this.extent(),
      origin: this.origin(),
      origins: this.origins(),
      resolutions: this.resolutions()!,
      matrixIds: this.matrixIds(),
      sizes: this.sizes(),
      tileSize: this.tileSize(),
      tileSizes: this.tileSizes(),
    };
  }
}
