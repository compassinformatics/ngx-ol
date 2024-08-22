import { Component, OnInit, Input, Optional, SimpleChanges, OnChanges } from '@angular/core';
import { VectorTile } from 'ol/layer';
import { Feature } from 'ol';
import { MapComponent } from '../map.component';
import { LayerComponent } from './layer.component';
import { LayerGroupComponent } from './layergroup.component';
import { StyleLike } from 'ol/style/Style';
import { Options } from 'ol/source/VectorTile';

@Component({
  selector: 'aol-layer-vectortile',
  template: ` <ng-content></ng-content> `,
})
export class LayerVectorTileComponent extends LayerComponent implements OnInit, OnChanges {
  @Input()
  renderBuffer: number;
  @Input()
  renderMode: any | string;
  /* not marked as optional in the typings */
  @Input()
  renderOrder: (feature1: Feature, feature2: Feature) => number;
  @Input()
  style: StyleLike | null | undefined;
  @Input()
  updateWhileAnimating: boolean;
  @Input()
  updateWhileInteracting: boolean;
  @Input()
  visible: boolean;

  constructor(map: MapComponent, @Optional() group?: LayerGroupComponent) {
    super(group || map);
  }

  ngOnInit() {
    // console.log('creating ol.layer.VectorTile instance with:', this);
    this.instance = new VectorTile(this as Options);
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
