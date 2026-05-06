import {
  Component,
  OnDestroy,
  OnInit,
  Optional,
  OnChanges,
  SimpleChanges,
  input,
} from '@angular/core';
import Tile from 'ol/layer/Tile';
import { Options } from 'ol/layer/BaseTile';
import { MapComponent } from '../map.component';
import { LayerComponent } from './layer.component';
import { LayerGroupComponent } from './layergroup.component';
import TileSource from 'ol/source/Tile';

@Component({
  selector: 'aol-layer-tile',
  template: ` <ng-content></ng-content> `,
})
export class LayerTileComponent extends LayerComponent implements OnInit, OnDestroy, OnChanges {
  readonly preload = input<number>();
  readonly useInterimTilesOnError = input<boolean>();
  readonly cacheSize = input<number>();
  readonly source = input<TileSource>();

  constructor(map: MapComponent, @Optional() group?: LayerGroupComponent) {
    super(group || map);
  }

  ngOnInit() {
    // console.log('creating ol.layer.Tile instance with:', this);
    this.setInstance(new Tile(this.createOptions()));
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  private createOptions(): Options<TileSource> {
    return {
      ...this.createLayerOptions(),
      preload: this.preload(),
      useInterimTilesOnError: this.useInterimTilesOnError(),
      cacheSize: this.cacheSize(),
      source: this.source(),
    };
  }
}
