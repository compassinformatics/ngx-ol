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
import VectorImage from 'ol/layer/VectorImage';
import { StyleLike } from 'ol/style/Style';
import { Options } from 'ol/layer/BaseVector';
import { LayerComponent } from './layer.component';
import { LayerGroupComponent } from './layergroup.component';
import { BackgroundColor } from 'ol/layer/Base';
import { FlatStyleLike } from 'ol/style/flat';
import VectorSource from 'ol/source/Vector';

@Component({
  selector: 'aol-layer-vectorimage',
  template: ` <ng-content></ng-content> `,
})
export class LayerVectorImageComponent
  extends LayerComponent
  implements OnInit, OnDestroy, OnChanges
{
  renderBuffer = input<number>();
  style = input<StyleLike | FlatStyleLike | null | undefined>();
  declutter = input<boolean | string | number>();
  background = input<BackgroundColor>();
  imageRatio = input<number>();
  properties = input<Record<string, any>>();
  source = input<VectorSource>();

  constructor(map: MapComponent, @Optional() group?: LayerGroupComponent) {
    super(group || map);
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
