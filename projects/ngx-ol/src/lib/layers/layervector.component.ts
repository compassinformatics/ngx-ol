import {
  Component,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
  input,
  inject,
} from '@angular/core';
import { MapComponent } from '../map.component';
import Vector from 'ol/layer/Vector';
import { StyleLike } from 'ol/style/Style';
import { Options } from 'ol/layer/BaseVector';
import { LayerComponent } from './layer.component';
import { LayerGroupComponent } from './layergroup.component';
import { BackgroundColor } from 'ol/layer/Base';
import { FlatStyleLike } from 'ol/style/flat';
import { OrderFunction } from 'ol/render';
import VectorSource from 'ol/source/Vector';

@Component({
  selector: 'aol-layer-vector',
  template: ` <ng-content></ng-content> `,
})
export class LayerVectorComponent extends LayerComponent implements OnInit, OnDestroy, OnChanges {
  renderOrder = input<OrderFunction>();

  renderBuffer = input<number>();

  style = input<StyleLike | FlatStyleLike | null | undefined>();

  updateWhileAnimating = input<boolean>();

  updateWhileInteracting = input<boolean>();

  declutter = input<boolean | string | number>();

  background = input<BackgroundColor>();

  properties = input<Record<string, any>>();

  source = input<VectorSource>();

  constructor() {
    super(inject(LayerGroupComponent, { optional: true }) || inject(MapComponent));
  }

  ngOnInit() {
    // console.log('creating ol.layer.Vector instance with:', this);
    this.setInstance(new Vector(this.createOptions()));
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

  private createOptions(): Options<any, VectorSource<any>> {
    return {
      ...this.createLayerOptions(),
      renderOrder: this.renderOrder(),
      renderBuffer: this.renderBuffer(),
      style: this.style(),
      updateWhileAnimating: this.updateWhileAnimating(),
      updateWhileInteracting: this.updateWhileInteracting(),
      declutter: this.declutter(),
      background: this.background(),
      properties: this.properties(),
      source: this.source(),
    };
  }
}
