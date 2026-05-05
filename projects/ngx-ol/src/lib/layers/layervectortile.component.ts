import { Component, OnInit, Input, Optional, SimpleChanges, OnChanges } from '@angular/core';
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
  @Input() renderBuffer: number;
  @Input() renderMode?: VectorTileRenderType;
  @Input() renderOrder?: OrderFunction;
  @Input() style: StyleLike | StyleFunction | null | undefined;
  @Input() background?: BackgroundColor;
  @Input() updateWhileAnimating: boolean;
  @Input() updateWhileInteracting: boolean;
  @Input() visible: boolean;
  @Input() source?: VectorTileSource;

  constructor(map: MapComponent, @Optional() group?: LayerGroupComponent) {
    super(group || map);
  }

  ngOnInit() {
    // console.log('creating ol.layer.VectorTile instance with:', this);
    this.instance = new VectorTile(this.createOptions());
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
      renderBuffer: this.renderBuffer,
      renderMode: this.renderMode,
      renderOrder: this.renderOrder,
      style: this.style,
      background: this.background,
      updateWhileAnimating: this.updateWhileAnimating,
      updateWhileInteracting: this.updateWhileInteracting,
      visible: this.visible,
      source: this.source,
    };
  }
}
