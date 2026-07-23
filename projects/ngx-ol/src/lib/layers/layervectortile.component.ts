import { Component, OnInit, SimpleChanges, OnChanges, input, inject } from '@angular/core';
import VectorTile from 'ol/layer/VectorTile.js';
import { MapComponent } from '../map.component';
import { LayerComponent } from './layer.component';
import { LayerGroupComponent } from './layergroup.component';
import { StyleLike, StyleFunction } from 'ol/style/Style.js';
import { Options, VectorTileRenderType } from 'ol/layer/VectorTile.js';
import { BackgroundColor } from 'ol/layer/Base.js';
import { OrderFunction } from 'ol/render.js';
import VectorTileSource from 'ol/source/VectorTile.js';

@Component({
  selector: 'aol-layer-vectortile',
  template: ` <ng-content></ng-content> `,
})
export class LayerVectorTileComponent extends LayerComponent implements OnInit, OnChanges {
  readonly renderBuffer = input<number>();
  readonly renderMode = input<VectorTileRenderType>();
  readonly renderOrder = input<OrderFunction>();
  readonly style = input<StyleLike | StyleFunction | null | undefined>();
  readonly background = input<BackgroundColor>();
  readonly updateWhileAnimating = input<boolean>();
  readonly updateWhileInteracting = input<boolean>();
  readonly visible = input<boolean>();
  readonly source = input<VectorTileSource>();

  constructor() {
    super(inject(LayerGroupComponent, { optional: true }) || inject(MapComponent));
  }

  ngOnInit() {
    // console.log('creating ol.layer.VectorTile instance with:', this);
    this.setInstance(new VectorTile(this.createOptions()));
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    const { style } = changes;
    if (style && this.instance) {
      this.instance.setStyle(style.currentValue);
    }
    if (this.instance && changes.renderOrder) {
      this.instance.setRenderOrder(changes.renderOrder.currentValue);
    }
    if (this.instance && changes.source) {
      this.instance.setSource(changes.source.currentValue);
    }
  }

  private createOptions(): Options<VectorTileSource> {
    return {
      ...this.createLayerOptions(),
      renderBuffer: this.renderBuffer(),
      renderMode: this.renderMode(),
      renderOrder: this.renderOrder(),
      style: this.style(),
      background: this.background(),
      updateWhileAnimating: this.updateWhileAnimating(),
      updateWhileInteracting: this.updateWhileInteracting(),
      visible: this.visible(),
      source: this.source(),
    };
  }
}
