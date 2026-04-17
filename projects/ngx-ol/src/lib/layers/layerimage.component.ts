import { Component, Input, OnChanges, OnInit, Optional, SimpleChanges } from '@angular/core';
import { Image } from 'ol/layer';
import { MapComponent } from '../map.component';
import { LayerComponent } from './layer.component';
import { LayerGroupComponent } from './layergroup.component';
import ImageSource from 'ol/source/Image';

@Component({
  selector: 'aol-layer-image',
  template: ` <ng-content></ng-content> `,
})
export class LayerImageComponent extends LayerComponent implements OnInit, OnChanges {
  @Input()
  source?: ImageSource;

  constructor(map: MapComponent, @Optional() group?: LayerGroupComponent) {
    super(group || map);
  }

  ngOnInit() {
    this.instance = new Image(this);
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
