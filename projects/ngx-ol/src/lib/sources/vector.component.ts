import {
  signal,
  Component,
  Host,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
  forwardRef,
  input,
} from '@angular/core';
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
  overlaps = input<boolean>();
  features = input<FeatureLike[] | Collection<FeatureLike> | undefined>();
  useSpatialIndex = input<boolean>();
  wrapX = input<boolean>();
  loader = input<FeatureLoader<FeatureLike>>();
  url = input<string | FeatureUrlFunction>();
  format = input<FeatureFormat<any>>();
  strategy = input<LoadingStrategy>();

  instance: Vector<FeatureLike>;

  protected readonly _instanceSignal = signal<Vector<FeatureLike> | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Vector<FeatureLike>): Vector<FeatureLike> {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(
    @Optional() @Host() vectorLayer: LayerVectorComponent,
    @Optional() @Host() vectorImageLayer: LayerVectorImageComponent,
    @Optional() @Host() heatmapLayer: LayerHeatmapComponent,
  ) {
    super(vectorLayer || vectorImageLayer || heatmapLayer);
  }

  ngOnInit() {
    this.setInstance(new Vector<FeatureLike>(this.createOptions()));
    this.host.instance.setSource(this.instance);
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    const { features } = changes;
    const requiresReload = Object.keys(changes).some(
      (key) => key !== 'features' && !changes[key].firstChange,
    );

    if (requiresReload && this.instance) {
      this.reloadInstance();
      return;
    }

    if (features?.currentValue && this.instance) {
      this.instance.clear();
      this.instance.addFeatures(features.currentValue);
    }
  }

  private reloadInstance() {
    this.setInstance(new Vector<FeatureLike>(this.createOptions()));
    this.host.instance.setSource(this.instance);
  }

  private createOptions(): Options<FeatureLike> {
    return {
      attributions: this.attributions(),
      overlaps: this.overlaps(),
      features: this.features(),
      useSpatialIndex: this.useSpatialIndex(),
      wrapX: this.wrapX(),
      loader: this.loader(),
      url: this.url(),
      format: this.format(),
      strategy: this.strategy(),
    };
  }
}
