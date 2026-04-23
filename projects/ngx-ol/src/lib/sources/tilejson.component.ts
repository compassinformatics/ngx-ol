import { Component, Host, Input, OnInit, forwardRef } from '@angular/core';
import { TileJSON } from 'ol/source';
import { Config } from 'ol/source/TileJSON';
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
export class SourceTileJSONComponent extends SourceComponent implements OnInit {
  @Input()
  cacheSize: number;
  @Input()
  crossOrigin?: string | null;
  @Input()
  interpolate: boolean;
  @Input()
  jsonp: boolean;
  @Input()
  reprojectionErrorThreshold: number;
  @Input()
  tileJSON?: Config;
  @Input()
  tileLoadFunction?: LoadFunction;
  @Input()
  tileSize?: number | Size;
  @Input()
  url?: string;
  @Input()
  wrapX: boolean;
  @Input()
  transition: number;
  @Input()
  zDirection: number | NearestDirectionFunction;

  instance: TileJSON;

  constructor(@Host() layer: LayerTileComponent) {
    super(layer);
  }

  ngOnInit() {
    this.instance = new TileJSON(this);
    this.host.instance.setSource(this.instance);
  }
}
