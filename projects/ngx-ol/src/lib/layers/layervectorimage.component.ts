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
import { Style } from 'ol/style';
import { StyleFunction } from 'ol/style/Style';
import { LayerComponent } from './layer.component';
import { LayerGroupComponent } from './layergroup.component';
import { BackgroundColor } from 'ol/layer/Base';

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
  style: Style | Style[] | StyleFunction;

  @Input()
  declutter: boolean | string | number;

  @Input()
  background: BackgroundColor;

  @Input()
  imageRatio: number;

  @Input()
  properties: Record<string, any>;

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
  }
}
