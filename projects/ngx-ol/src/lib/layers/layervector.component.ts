import {
  Component,
  OnDestroy,
  OnInit,
  Optional,
  OnChanges,
  SimpleChanges,
  input,
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
  readonly renderOrder = input<OrderFunction>();
  readonly renderBuffer = input<number>();
  readonly style = input<StyleLike | FlatStyleLike | null | undefined>();
  readonly updateWhileAnimating = input<boolean>();
  readonly updateWhileInteracting = input<boolean>();
  readonly declutter = input<boolean | string | number>();
  readonly background = input<BackgroundColor>();
  readonly properties = input<Record<string, any>>();
  readonly source = input<VectorSource>();

  constructor(map: MapComponent, @Optional() group?: LayerGroupComponent) {
    super(group || map);
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
