import { Component, Input } from '@angular/core';
import GeoJSON from 'ol/format/GeoJSON.js';
import { ProjectionLike } from 'ol/proj';

@Component({
  selector: 'aol-format-geojson',
  template: '',
})
export class FormatGeoJSONComponent {
  @Input()
  featureClass: any;
  @Input()
  geometryName?: string;
  @Input()
  dataProjection?: ProjectionLike;
  @Input()
  featureProjection?: ProjectionLike;
  @Input()
  extractGeometryName?: boolean;

  public componentType = 'format';

  instance: GeoJSON;

  constructor() {
    this.instance = new GeoJSON(this);
  }
}
