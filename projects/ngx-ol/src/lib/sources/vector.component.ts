import {
  Component,
  Host,
  Input,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import { Vector } from 'ol/source';
import { LayerVectorComponent } from '../layers/layervector.component';
import { SourceComponent } from './source.component';
import { LoadingStrategy, Options } from 'ol/source/Vector';
import { LayerVectorImageComponent } from '../layers/layervectorimage.component';
import { Collection } from 'ol';
import { FeatureLike } from 'ol/Feature';
import FeatureFormat from 'ol/format/Feature';
import { FeatureLoader, FeatureUrlFunction } from 'ol/featureloader';

@Component({
  selector: 'aol-source-vector',
  template: ` <ng-content></ng-content> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceVectorComponent) }],
})
export class SourceVectorComponent extends SourceComponent implements OnInit, OnChanges {
  @Input()
  overlaps: boolean;
  @Input()
  features: FeatureLike[] | Collection<FeatureLike> | undefined;
  @Input()
  useSpatialIndex: boolean;
  @Input()
  wrapX: boolean;
  @Input()
  loader?: FeatureLoader<FeatureLike>;
  @Input()
  url?: string | FeatureUrlFunction;
  @Input()
  format?: FeatureFormat<any>;
  @Input()
  strategy?: LoadingStrategy;

  instance: Vector;

  constructor(
    @Optional() @Host() vectorLayer: LayerVectorComponent,
    @Optional() @Host() vectorImageLayer: LayerVectorImageComponent,
  ) {
    super(vectorLayer || vectorImageLayer);
  }

  ngOnInit() {
    (this.instance as Vector<FeatureLike>) = new Vector(this.createOptions());
    this.host.instance.setSource(this.instance);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { features } = changes;

    if (features?.currentValue && this.instance) {
      this.instance.clear();
      this.instance.addFeatures(features.currentValue);
    }
  }

  private createOptions(): Options<FeatureLike> {
    return {
      attributions: this.attributions,
      overlaps: this.overlaps,
      features: this.features,
      useSpatialIndex: this.useSpatialIndex,
      wrapX: this.wrapX,
      loader: this.loader,
      url: this.url,
      format: this.format,
      strategy: this.strategy,
    };
  }
}
