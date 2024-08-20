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
import Feature from 'ol/format/Feature';
import { LayerVectorComponent } from '../layers/layervector.component';
import { SourceComponent } from './source.component';
import { LoadingStrategy } from 'ol/source/Vector';
import { LayerVectorImageComponent } from '../layers/layervectorimage.component';
import { Collection } from 'ol';
import { FeatureLike } from 'ol/Feature';

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
  url: string;
  @Input()
  format: Feature;
  @Input()
  strategy: LoadingStrategy;

  instance: Vector;

  constructor(
    @Optional() @Host() vectorLayer: LayerVectorComponent,
    @Optional() @Host() vectorImageLayer: LayerVectorImageComponent,
  ) {
    super(vectorLayer || vectorImageLayer);
  }

  ngOnInit() {
    (this.instance as Vector<FeatureLike>) = new Vector(this);
    this.host.instance.setSource(this.instance);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { features } = changes;

    if (features?.currentValue && this.instance) {
      console.log('features change');
      this.instance.clear();
      this.instance.addFeatures(features.currentValue);
    }
  }
}
