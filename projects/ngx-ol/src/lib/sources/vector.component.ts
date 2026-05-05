import { Component, Host, Input, OnChanges, OnInit, Optional, SimpleChanges, forwardRef } from '@angular/core';
import Collection from 'ol/Collection.js';
import type { FeatureLike } from 'ol/Feature.js';
import type FeatureFormat from 'ol/format/Feature.js';
import type { FeatureLoader, FeatureUrlFunction } from 'ol/featureloader.js';
import Vector from 'ol/source/Vector.js';
import type { LoadingStrategy, Options } from 'ol/source/Vector.js';
import { LayerVectorComponent } from '../layers/layervector.component';
import { SourceComponent } from './source.component';
import { LayerVectorImageComponent } from '../layers/layervectorimage.component';
import { LayerHeatmapComponent } from '../layers/layerheatmap.component';

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
    @Optional() @Host() heatmapLayer: LayerHeatmapComponent,
  ) {
    super(vectorLayer || vectorImageLayer || heatmapLayer);
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
