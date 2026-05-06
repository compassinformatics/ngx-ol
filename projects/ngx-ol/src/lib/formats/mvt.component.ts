import { Component, OnChanges, SimpleChanges, signal, input } from '@angular/core';
import MVT from 'ol/format/MVT';
import { FeatureClass } from 'ol/Feature';
import { Options } from 'ol/format/MVT';

@Component({
  selector: 'aol-format-mvt',
  template: '',
})
export class FormatMVTComponent implements OnChanges {
  featureClass = input<FeatureClass>();
  geometryName = input<string>();
  layerName = input<string>();
  layers = input<string[]>();
  idProperty = input<string>();
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

  ngOnChanges(changes: SimpleChanges) {
    const requiresReload = Object.keys(changes).some((key) => !changes[key].firstChange);

    if (requiresReload) {
      this.setInstance(new MVT(this.createOptions()));
    }
  }

  private createOptions(): Options<any> {
    return {
      featureClass: this.featureClass(),
      geometryName: this.geometryName(),
      layerName: this.layerName(),
      layers: this.layers(),
      idProperty: this.idProperty(),
    };
  }
}
