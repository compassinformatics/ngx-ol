import { Component, Input, signal } from '@angular/core';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Options } from 'ol/format/GeoJSON';
import { ProjectionLike } from 'ol/proj';

@Component({
  selector: 'aol-format-geojson',
  template: '',
})
export class FormatGeoJSONComponent {
  @Input() featureClass: any;
  @Input() geometryName?: string;
  @Input() dataProjection?: ProjectionLike;
  @Input() featureProjection?: ProjectionLike;
  @Input() extractGeometryName?: boolean;

  public componentType = 'format';

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

  private createOptions(): Options {
    return {
      featureClass: this.featureClass,
      geometryName: this.geometryName,
      dataProjection: this.dataProjection,
      featureProjection: this.featureProjection,
      extractGeometryName: this.extractGeometryName,
    };
  }
}
