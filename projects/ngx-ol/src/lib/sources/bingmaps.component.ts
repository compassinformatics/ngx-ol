import { Component, Host, Input, OnInit, forwardRef } from '@angular/core';
import { BingMaps } from 'ol/source';
import { SourceComponent } from './source.component';
import { LayerTileComponent } from '../layers/layertile.component';
import { LoadFunction } from 'ol/Tile';
import { NearestDirectionFunction } from 'ol/array';

@Component({
  selector: 'aol-source-bingmaps',
  template: ` <div class="aol-source-bingmaps"></div> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceBingmapsComponent) }],
})
export class SourceBingmapsComponent extends SourceComponent implements OnInit {
  @Input()
  cacheSize?: number;
  @Input()
  hidpi: boolean;
  @Input()
  culture: string;
  @Input()
  key: string;
  @Input()
  imagerySet: 'Road' | 'Aerial' | 'AerialWithLabels' | 'collinsBart' | 'ordnanceSurvey' = 'Aerial';
  @Input()
  maxZoom: number;
  @Input()
  reprojectionErrorThreshold: number;
  @Input()
  tileLoadFunction?: LoadFunction;
  @Input()
  wrapX: boolean;
  @Input()
  interpolate: boolean;
  @Input()
  placeholderTiles?: boolean;
  @Input()
  transition?: number;
  @Input()
  zDirection: number | NearestDirectionFunction;

  instance: BingMaps;

  constructor(@Host() layer: LayerTileComponent) {
    super(layer);
  }

  ngOnInit() {
    this.instance = new BingMaps(this);
    this.host.instance.setSource(this.instance);
  }
}
