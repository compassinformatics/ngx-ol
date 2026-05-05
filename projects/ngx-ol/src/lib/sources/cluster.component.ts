import {
  signal,
  AfterContentInit,
  Component,
  ContentChild,
  forwardRef,
  Host,
  OnChanges,
  Optional,
  SimpleChanges,
  input,
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
  distance = input<number>();
  minDistance = input<number>();
  geometryFunction = input<(feature: Feature) => Point>();
  wrapX = input<boolean>();
  createCluster = input<any>();

  @ContentChild(SourceVectorComponent, { static: false })
  sourceVectorComponent: SourceVectorComponent;

  instance: Cluster<any>;

  protected readonly _instanceSignal = signal<Cluster<any> | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Cluster<any>): Cluster<any> {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  source: Vector<any>;

  constructor(
    @Optional() @Host() vectorLayer: LayerVectorComponent,
    @Optional() @Host() vectorImageLayer: LayerVectorImageComponent,
  ) {
    super(vectorLayer || vectorImageLayer);
  }

  ngAfterContentInit() {
    this.source = this.sourceVectorComponent.instance;

    this.setInstance(new Cluster(this.createOptions()));
    this.host.instance.setSource(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    const distance = this.distance();
    if (this.instance && changes.hasOwnProperty('distance') && distance !== undefined) {
      this.instance.setDistance(distance);
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
