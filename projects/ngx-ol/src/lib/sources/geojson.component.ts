import { Component, Host, Input, OnInit, Optional, forwardRef } from '@angular/core';
import { LayerVectorComponent } from '../layers/layervector.component';
import { SourceComponent } from './source.component';
import FeatureFormat from 'ol/format/Feature';
import { Vector } from 'ol/source';
import { GeoJSON } from 'ol/format';
import { Options as GeoJSONOptions } from 'ol/format/GeoJSON';
import { ProjectionLike } from 'ol/proj';
import { LayerVectorImageComponent } from '../layers/layervectorimage.component';
import { Options as VectorOptions } from 'ol/source/Vector';

@Component({
  selector: 'aol-source-geojson',
  template: ` <ng-content></ng-content> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceGeoJSONComponent) }],
})
export class SourceGeoJSONComponent extends SourceComponent implements OnInit {
  @Input()
  defaultDataProjection: ProjectionLike;
  @Input()
  featureProjection: ProjectionLike;
  @Input()
  geometryName: string;
  @Input()
  url: string;

  instance: Vector;
  format: FeatureFormat;

  constructor(
    @Optional() @Host() vectorLayer: LayerVectorComponent,
    @Optional() @Host() vectorImageLayer: LayerVectorImageComponent,
  ) {
    super(vectorLayer || vectorImageLayer);
  }

  ngOnInit() {
    this.format = new GeoJSON(this.createFormatOptions());
    this.instance = new Vector(this.createVectorOptions());
    this.host.instance.setSource(this.instance);
  }

  private createFormatOptions(): GeoJSONOptions {
    return {
      dataProjection: this.defaultDataProjection,
      featureProjection: this.featureProjection,
      geometryName: this.geometryName,
    };
  }

  private createVectorOptions(): VectorOptions {
    return {
      attributions: this.attributions,
      format: this.format,
      url: this.url,
    };
  }
}
