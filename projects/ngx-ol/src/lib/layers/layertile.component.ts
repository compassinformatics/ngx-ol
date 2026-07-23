import {
  Component,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
  input,
  inject,
} from '@angular/core';
import Tile from 'ol/layer/Tile.js';
import { Options } from 'ol/layer/BaseTile.js';
import { MapComponent } from '../map.component';
import { LayerComponent } from './layer.component';
import { LayerGroupComponent } from './layergroup.component';
import TileSource from 'ol/source/Tile.js';

@Component({
  selector: 'aol-layer-tile',
  template: ` <ng-content></ng-content> `,
})
export class LayerTileComponent extends LayerComponent implements OnInit, OnDestroy, OnChanges {
  readonly preload = input<number>();
  readonly useInterimTilesOnError = input<boolean>();
  readonly cacheSize = input<number>();
  readonly source = input<TileSource>();

  constructor() {
    super(inject(LayerGroupComponent, { optional: true }) || inject(MapComponent));
  }

  ngOnInit() {
    // console.log('creating ol.layer.Tile instance with:', this);
    this.setInstance(new Tile(this.createOptions()));
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (!this.instance) {
      return;
    }
    if (changes.preload?.currentValue !== undefined) {
      this.instance.setPreload(changes.preload.currentValue);
    }
    if (changes.useInterimTilesOnError?.currentValue !== undefined) {
      this.instance.setUseInterimTilesOnError(changes.useInterimTilesOnError.currentValue);
    }
    if (changes.source) {
      this.instance.setSource(changes.source.currentValue);
    }
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
