import {
  signal,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SimpleChanges,
  input,
} from '@angular/core';
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
export class LayerWebGLTileComponent
  extends LayerComponent
  implements OnInit, OnDestroy, OnChanges
{
  style = input<Style>();
  preload = input<number>();
  source = input<DataTileSource<DataTile>>();
  sources = input<
    DataTileSource<DataTile>[] | ((extent: Extent, resolution: number) => SourceType[])
  >();
  map = input<MapComponent['instance']>();
  useInterimTilesOnError = input<boolean>();
  cacheSize = input<number>();
  instance: WebGLTileLayer;
  protected readonly _instanceSignal = signal<WebGLTileLayer | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: WebGLTileLayer): WebGLTileLayer {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(map: MapComponent, @Optional() group?: LayerGroupComponent) {
    super(group || map);
  }

  ngOnInit() {
    this.setInstance(new WebGLTileLayer(this.createOptions()));
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
      style: this.style(),
      preload: this.preload(),
      source: this.source(),
      sources: this.sources(),
      map: this.map(),
      useInterimTilesOnError: this.useInterimTilesOnError(),
      cacheSize: this.cacheSize(),
    };
  }
}
