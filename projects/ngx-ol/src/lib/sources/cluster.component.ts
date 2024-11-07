import {
  AfterContentInit,
  Component,
  ContentChild,
  forwardRef,
  Host,
  Input,
  OnChanges,
  Optional,
  SimpleChanges,
} from '@angular/core';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Cluster, Vector } from 'ol/source';

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
  @Input()
  distance: number;
  @Input()
  minDistance: number;
  @Input()
  geometryFunction?: (feature: Feature) => Point;
  @Input()
  wrapX?: boolean;
  @Input()
  createCluster: any;

  @ContentChild(SourceVectorComponent, { static: false })
  sourceVectorComponent: SourceVectorComponent;

  instance: Cluster<any>;
  source: Vector<any>;

  constructor(
    @Optional() @Host() vectorLayer: LayerVectorComponent,
    @Optional() @Host() vectorImageLayer: LayerVectorImageComponent,
  ) {
    super(vectorLayer || vectorImageLayer);
  }

  ngAfterContentInit() {
    this.source = this.sourceVectorComponent.instance;

    this.instance = new Cluster(this);
    this.host.instance.setSource(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.instance && changes.hasOwnProperty('distance')) {
      this.instance.setDistance(this.distance);
    }
  }
}
