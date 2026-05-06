import { Component, OnInit, signal, input } from '@angular/core';
import WMTS, { Options } from 'ol/tilegrid/WMTS';
import { TileGridComponent } from './tilegrid.component';
import { Coordinate } from 'ol/coordinate';
import { Size } from 'ol/size';

@Component({
  selector: 'aol-tilegrid-wmts',
  template: '',
})
export class TileGridWMTSComponent extends TileGridComponent implements OnInit {
  origin = input<Coordinate>();
  origins = input<Coordinate[]>();
  override resolutions = input<number[]>();
  matrixIds = input.required<string[]>();
  sizes = input<Size[]>();
  tileSize = input<number | Size>();
  tileSizes = input<(number | Size)[]>();
  instance: WMTS;
  protected readonly _instanceSignal = signal<WMTS | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: WMTS): WMTS {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  ngOnInit() {
    this.createInstance();
  }

  protected override createInstance() {
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
