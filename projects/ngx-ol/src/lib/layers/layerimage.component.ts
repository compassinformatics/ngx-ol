import { Component, OnChanges, OnInit, SimpleChanges, input, inject } from '@angular/core';
import Image from 'ol/layer/Image.js';
import { Options } from 'ol/layer/BaseImage.js';
import { MapComponent } from '../map.component';
import { LayerComponent } from './layer.component';
import { LayerGroupComponent } from './layergroup.component';
import ImageSource from 'ol/source/Image.js';

@Component({
  selector: 'aol-layer-image',
  template: ` <ng-content></ng-content> `,
})
export class LayerImageComponent extends LayerComponent implements OnInit, OnChanges {
  readonly source = input<ImageSource>();

  constructor() {
    super(inject(LayerGroupComponent, { optional: true }) || inject(MapComponent));
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
