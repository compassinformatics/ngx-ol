import {
  signal,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SimpleChanges,
} from '@angular/core';
import type { FeatureLike } from 'ol/Feature';
import Heatmap from 'ol/layer/Heatmap';
import type { Options } from 'ol/layer/Heatmap';
import VectorSource from 'ol/source/Vector';
import { MapComponent } from '../map.component';
import { LayerComponent } from './layer.component';
import { LayerGroupComponent } from './layergroup.component';

@Component({
  selector: 'aol-layer-heatmap',
  template: ` <ng-content></ng-content> `,
})
export class LayerHeatmapComponent extends LayerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() gradient?: string[];

  @Input() radius?: number;

  @Input() blur?: number;

  @Input() weight?: string | ((feature: FeatureLike) => number);

  @Input() source?: VectorSource<FeatureLike>;

  @Input() properties?: Record<string, any>;

  instance: Heatmap<FeatureLike, VectorSource<FeatureLike>>;

  protected readonly _instanceSignal = signal<
    Heatmap<FeatureLike, VectorSource<FeatureLike>> | undefined
  >(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(
    instance: Heatmap<FeatureLike, VectorSource<FeatureLike>>,
  ): Heatmap<FeatureLike, VectorSource<FeatureLike>> {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(map: MapComponent, @Optional() group?: LayerGroupComponent) {
    super(group || map);
  }

  ngOnInit() {
    this.setInstance(new Heatmap(this.createOptions()));
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    if (!this.instance) {
      return;
    }

    if (changes.gradient?.currentValue) {
      this.instance.setGradient(changes.gradient.currentValue);
    }

    if (changes.radius?.currentValue !== undefined) {
      this.instance.setRadius(changes.radius.currentValue);
    }

    if (changes.blur?.currentValue !== undefined) {
      this.instance.setBlur(changes.blur.currentValue);
    }
  }

  private createOptions(): Options<FeatureLike, VectorSource<FeatureLike>> {
    return {
      ...this.createLayerOptions(),
      gradient: this.gradient,
      radius: this.radius,
      blur: this.blur,
      weight: this.weight,
      source: this.source,
      properties: this.properties,
    };
  }
}
