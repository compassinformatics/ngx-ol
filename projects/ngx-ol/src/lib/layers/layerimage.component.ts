import { Component, OnChanges, OnInit, Optional, SimpleChanges, input } from '@angular/core';
import Image from 'ol/layer/Image';
import { Options } from 'ol/layer/BaseImage';
import { MapComponent } from '../map.component';
import { LayerComponent } from './layer.component';
import { LayerGroupComponent } from './layergroup.component';
import ImageSource from 'ol/source/Image';

@Component({
  selector: 'aol-layer-image',
  template: ` <ng-content></ng-content> `,
})
export class LayerImageComponent extends LayerComponent implements OnInit, OnChanges {
  source = input<ImageSource>();

  constructor(map: MapComponent, @Optional() group?: LayerGroupComponent) {
    super(group || map);
  }

  ngOnInit() {
    this.setInstance(new Image(this.createOptions()));
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  private createOptions(): Options<ImageSource> {
    return {
      ...this.createLayerOptions(),
      source: this.source(),
    };
  }
}
