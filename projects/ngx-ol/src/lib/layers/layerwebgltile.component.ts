import { Component, Input, OnChanges, OnDestroy, OnInit, Optional, SimpleChanges } from '@angular/core';
import WebGLTileLayer from 'ol/layer/WebGLTile';
import type { Options, SourceType, Style } from 'ol/layer/WebGLTile';
import type DataTileSource from 'ol/source/DataTile';
import type DataTile from 'ol/DataTile';
import type { Extent } from 'ol/extent';
import { MapComponent } from '../map.component';
import { LayerComponent } from './layer.component';
import { LayerGroupComponent } from './layergroup.component';

@Component({
  selector: 'aol-layer-webgltile',
  template: ` <ng-content></ng-content> `,
})
export class LayerWebGLTileComponent extends LayerComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  style?: Style;

  @Input()
  preload?: number;

  @Input()
  source?: DataTileSource<DataTile>;

  @Input()
  sources?: DataTileSource<DataTile>[] | ((extent: Extent, resolution: number) => SourceType[]);

  @Input()
  map?: MapComponent['instance'];

  @Input()
  useInterimTilesOnError?: boolean;

  @Input()
  cacheSize?: number;

  instance: WebGLTileLayer;

  constructor(map: MapComponent, @Optional() group?: LayerGroupComponent) {
    super(group || map);
  }

  ngOnInit() {
    this.instance = new WebGLTileLayer(this.createOptions());
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    if (this.instance && changes.style?.currentValue) {
      this.instance.setStyle(changes.style.currentValue);
    }
  }

  private createOptions(): Options {
    return {
      ...this.createLayerOptions(),
      style: this.style,
      preload: this.preload,
      source: this.source,
      sources: this.sources,
      map: this.map,
      useInterimTilesOnError: this.useInterimTilesOnError,
      cacheSize: this.cacheSize,
    };
  }
}
