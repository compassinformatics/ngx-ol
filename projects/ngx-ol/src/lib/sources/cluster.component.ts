import {
  AfterContentInit,
  Component,
  OnChanges,
  SimpleChanges,
  contentChild,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Cluster from 'ol/source/Cluster';
import Vector from 'ol/source/Vector';
import { Options } from 'ol/source/Cluster';

import { LayerVectorComponent } from '../layers/layervector.component';
import { SourceComponent } from './source.component';
import { SourceVectorComponent } from './vector.component';
import { LayerVectorImageComponent } from '../layers/layervectorimage.component';

@Component({
  selector: 'aol-source-cluster',
  template: ` <ng-content></ng-content> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceClusterComponent) }],
})
export class SourceClusterComponent extends SourceComponent implements AfterContentInit, OnChanges {
  readonly distance = input<number>();
  readonly minDistance = input<number>();
  readonly geometryFunction = input<(feature: Feature) => Point>();
  readonly wrapX = input<boolean>();
  readonly createCluster = input<any>();

  protected readonly sourceVectorComponent = contentChild(SourceVectorComponent);

  instance: Cluster<any>;

  protected readonly _instanceSignal = signal<Cluster<any> | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Cluster<any>): Cluster<any> {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  source: Vector<any>;

  constructor() {
    super(
      inject(LayerVectorComponent, { optional: true, host: true }) ||
        inject(LayerVectorImageComponent, { optional: true, host: true })!,
    );
  }

  ngAfterContentInit() {
    const sourceVectorComponent = this.sourceVectorComponent();

    if (sourceVectorComponent) {
      this.source = sourceVectorComponent.instance;
    }

    this.setInstance(new Cluster(this.createOptions()));
    this.host.instance.setSource(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (this.instance && changes.hasOwnProperty('distance') && this.distance() !== undefined) {
      this.instance.setDistance(this.distance()!);
    }
    if (
      this.instance &&
      changes.hasOwnProperty('minDistance') &&
      this.minDistance() !== undefined
    ) {
      this.instance.setMinDistance(this.minDistance()!);
    }
  }

  private createOptions(): Options<any> {
    return {
      distance: this.distance(),
      minDistance: this.minDistance(),
      geometryFunction: this.geometryFunction(),
      wrapX: this.wrapX(),
      createCluster: this.createCluster(),
      source: this.source,
    };
  }
}
