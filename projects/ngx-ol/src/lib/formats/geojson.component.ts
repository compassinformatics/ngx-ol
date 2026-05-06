import { Component, OnChanges, SimpleChanges, signal, input } from '@angular/core';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Options } from 'ol/format/GeoJSON';
import { ProjectionLike } from 'ol/proj';

@Component({
  selector: 'aol-format-geojson',
  template: '',
})
export class FormatGeoJSONComponent implements OnChanges {
  readonly featureClass = input<any>();
  readonly geometryName = input<string>();
  readonly dataProjection = input<ProjectionLike>();
  readonly featureProjection = input<ProjectionLike>();
  readonly extractGeometryName = input<boolean>();
  readonly componentType: string = 'format';
  instance: GeoJSON;
  protected readonly _instanceSignal = signal<GeoJSON | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: GeoJSON): GeoJSON {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor() {
    this.setInstance(new GeoJSON(this.createOptions()));
  }

  ngOnChanges(changes: SimpleChanges) {
    const requiresReload = Object.keys(changes).some((key) => !changes[key].firstChange);

    if (requiresReload) {
      this.setInstance(new GeoJSON(this.createOptions()));
    }
  }

  private createOptions(): Options {
    return {
      featureClass: this.featureClass(),
      geometryName: this.geometryName(),
      dataProjection: this.dataProjection(),
      featureProjection: this.featureProjection(),
      extractGeometryName: this.extractGeometryName(),
    };
  }
}
