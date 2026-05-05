import { Component, Input, signal } from '@angular/core';
import MVT from 'ol/format/MVT';
import { FeatureClass } from 'ol/Feature';
import { Options } from 'ol/format/MVT';

@Component({
  selector: 'aol-format-mvt',
  template: '',
})
export class FormatMVTComponent {
  @Input() featureClass?: FeatureClass;
  @Input() geometryName?: string;
  @Input() layerName?: string;
  @Input() layers?: string[];
  @Input() idProperty?: string;

  public componentType = 'format';

  instance: MVT;

  protected readonly _instanceSignal = signal<MVT | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: MVT): MVT {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor() {
    this.setInstance(new MVT(this.createOptions()));
  }

  private createOptions(): Options<any> {
    return {
      featureClass: this.featureClass,
      geometryName: this.geometryName,
      layerName: this.layerName,
      layers: this.layers,
      idProperty: this.idProperty,
    };
  }
}
