import { Component, Input } from '@angular/core';
import { MVT } from 'ol/format';
import { FeatureClass } from 'ol/Feature';
import { Options } from 'ol/format/MVT';

@Component({
  selector: 'aol-format-mvt',
  template: '',
})
export class FormatMVTComponent {
  @Input()
  featureClass: FeatureClass;
  @Input()
  geometryName: string;
  @Input()
  layerName: string;
  @Input()
  layers: string[];

  public componentType = 'format';

  instance: MVT;

  constructor() {
    this.instance = new MVT(this as Options);
  }
}
