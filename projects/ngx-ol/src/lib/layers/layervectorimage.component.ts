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
import VectorImage from 'ol/layer/VectorImage.js';
import { StyleLike } from 'ol/style/Style.js';
import { Options } from 'ol/layer/BaseVector.js';
import { LayerComponent } from './layer.component';
import { LayerGroupComponent } from './layergroup.component';
import { BackgroundColor } from 'ol/layer/Base.js';
import { FlatStyleLike } from 'ol/style/flat.js';
import VectorSource from 'ol/source/Vector.js';

@Component({
  selector: 'aol-layer-vectorimage',
  template: ` <ng-content></ng-content> `,
})
export class LayerVectorImageComponent
  extends LayerComponent
  implements OnInit, OnDestroy, OnChanges
{
  readonly renderBuffer = input<number>();

  readonly style = input<StyleLike | FlatStyleLike | null | undefined>();

  readonly declutter = input<boolean | string | number>();

  readonly background = input<BackgroundColor>();

  readonly imageRatio = input<number>();

  readonly properties = input<Record<string, any>>();

  readonly source = input<VectorSource>();

  constructor() {
    super(inject(LayerGroupComponent, { optional: true }) || inject(MapComponent));
  }

  ngOnInit() {
    // console.log('creating ol.layer.Vector instance with:', this);
    this.setInstance(new VectorImage(this.createOptions()));
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    const { style } = changes;
    if (style && this.instance) {
      this.instance.setStyle(style.currentValue);
    }
    if (this.instance && changes.source) {
      this.instance.setSource(changes.source.currentValue);
    }
  }

  private createOptions(): Options<any, VectorSource<any>> & { imageRatio?: number } {
    return {
      ...this.createLayerOptions(),
      renderBuffer: this.renderBuffer(),
      style: this.style(),
      declutter: this.declutter(),
      background: this.background(),
      imageRatio: this.imageRatio(),
      properties: this.properties(),
      source: this.source(),
    };
  }
}
