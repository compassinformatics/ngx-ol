import { Component, Input, OnInit, signal } from '@angular/core';
import WMTS, { Options } from 'ol/tilegrid/WMTS';
import { TileGridComponent } from './tilegrid.component';
import { Coordinate } from 'ol/coordinate';
import { Size } from 'ol/size';

@Component({
  selector: 'aol-tilegrid-wmts',
  template: '',
})
export class TileGridWMTSComponent extends TileGridComponent implements OnInit {
  @Input() origin?: Coordinate;
  @Input() origins?: Coordinate[];
  @Input() resolutions: number[];
  @Input() matrixIds: string[];
  @Input() sizes?: Size[];
  @Input() tileSize?: number | Size;
  @Input() tileSizes?: (number | Size)[];

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

  private createOptions(): Options {
    return {
      extent: this.extent,
      origin: this.origin,
      origins: this.origins,
      resolutions: this.resolutions,
      matrixIds: this.matrixIds,
      sizes: this.sizes,
      tileSize: this.tileSize,
      tileSizes: this.tileSizes,
    };
  }
}
