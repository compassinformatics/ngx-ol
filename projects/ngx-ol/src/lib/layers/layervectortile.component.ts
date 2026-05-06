import { Component, OnInit, Optional, SimpleChanges, OnChanges, input } from '@angular/core';
import VectorTile from 'ol/layer/VectorTile';
import { MapComponent } from '../map.component';
import { LayerComponent } from './layer.component';
import { LayerGroupComponent } from './layergroup.component';
import { StyleLike, StyleFunction } from 'ol/style/Style';
import { Options, VectorTileRenderType } from 'ol/layer/VectorTile';
import { BackgroundColor } from 'ol/layer/Base';
import { OrderFunction } from 'ol/render';
import VectorTileSource from 'ol/source/VectorTile';

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

  constructor(map: MapComponent, @Optional() group?: LayerGroupComponent) {
    super(group || map);
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
