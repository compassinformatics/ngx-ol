import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  Optional,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MapComponent } from '../map.component';
import { VectorImage } from 'ol/layer';
import { StyleLike } from 'ol/style/Style';
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
  @Input()
  renderBuffer: number;

  @Input()
  style: StyleLike | FlatStyleLike | null | undefined;

  @Input()
  declutter: boolean | string | number;

  @Input()
  background?: BackgroundColor;

  @Input()
  imageRatio: number;

  @Input()
  properties: Record<string, any>;

  @Input()
  source?: VectorSource;

  constructor(map: MapComponent, @Optional() group?: LayerGroupComponent) {
    super(group || map);
  }

  ngOnInit() {
    // console.log('creating ol.layer.Vector instance with:', this);
    this.instance = new VectorImage(this);
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    const { style } = changes;
    if (style && this.instance) {
      this.instance.setStyle(style.currentValue);
    }
  }
}
