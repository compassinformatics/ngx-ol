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
import { Vector } from 'ol/layer';
import { StyleLike } from 'ol/style/Style';
import { LayerComponent } from './layer.component';
import { LayerGroupComponent } from './layergroup.component';
import { BackgroundColor } from 'ol/layer/Base';
import { FlatStyleLike } from 'ol/style/flat';

@Component({
  selector: 'aol-layer-vector',
  template: ` <ng-content></ng-content> `,
})
export class LayerVectorComponent extends LayerComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  renderBuffer: number;

  @Input()
  style: StyleLike | FlatStyleLike | null | undefined;

  @Input()
  updateWhileAnimating: boolean;

  @Input()
  updateWhileInteracting: boolean;

  @Input()
  declutter: boolean | string | number;

  @Input()
  background: BackgroundColor;

  @Input()
  properties: Record<string, any>;

  constructor(map: MapComponent, @Optional() group?: LayerGroupComponent) {
    super(group || map);
  }

  ngOnInit() {
    // console.log('creating ol.layer.Vector instance with:', this);
    this.instance = new Vector(this);
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
