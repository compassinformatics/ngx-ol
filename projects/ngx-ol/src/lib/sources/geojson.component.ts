import {
  Component,
  Host,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
  forwardRef,
  signal,
  input,
} from '@angular/core';
import { LayerVectorComponent } from '../layers/layervector.component';
import { SourceComponent } from './source.component';
import FeatureFormat from 'ol/format/Feature';
import Vector from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Options as GeoJSONOptions } from 'ol/format/GeoJSON';
import { ProjectionLike } from 'ol/proj';
import { LayerVectorImageComponent } from '../layers/layervectorimage.component';
import { Options as VectorOptions } from 'ol/source/Vector';

@Component({
  selector: 'aol-source-geojson',
  template: ` <ng-content></ng-content> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceGeoJSONComponent) }],
})
export class SourceGeoJSONComponent extends SourceComponent implements OnInit, OnChanges {
  readonly defaultDataProjection = input<ProjectionLike>();
  readonly featureProjection = input<ProjectionLike>();
  readonly geometryName = input<string>();
  readonly url = input<string>();
  instance: Vector;
  protected readonly _instanceSignal = signal<Vector | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Vector): Vector {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }
  format: FeatureFormat;

  constructor(
    @Optional() @Host() vectorLayer: LayerVectorComponent,
    @Optional() @Host() vectorImageLayer: LayerVectorImageComponent,
  ) {
    super(vectorLayer || vectorImageLayer);
  }

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    const requiresReload = Object.keys(changes).some((key) => !changes[key].firstChange);

    if (requiresReload && this.instance) {
      this.init();
    }
  }

  private init() {
    this.format = new GeoJSON(this.createFormatOptions());
    this.setInstance(new Vector(this.createVectorOptions()));
    this.host.instance.setSource(this.instance);
  }

  private createFormatOptions(): GeoJSONOptions {
    return {
      dataProjection: this.defaultDataProjection(),
      featureProjection: this.featureProjection(),
      geometryName: this.geometryName(),
    };
  }

  private createVectorOptions(): VectorOptions {
    return {
      attributions: this.attributions(),
      format: this.format,
      url: this.url(),
    };
  }
}
