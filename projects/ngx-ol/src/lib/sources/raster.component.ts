import {
  signal,
  AfterContentInit,
  AfterContentChecked,
  Component,
  ContentChild,
  forwardRef,
  Host,
  OnChanges,
  SimpleChanges,
  output,
  input,
} from '@angular/core';
import Raster from 'ol/source/Raster';
import Source from 'ol/source/Source';
import { Operation, Options, RasterSourceEvent } from 'ol/source/Raster';

import { LayerImageComponent } from '../layers/layerimage.component';
import { SourceComponent } from './source.component';

@Component({
  selector: 'aol-source-raster',
  template: ` <ng-content></ng-content> `,
  providers: [
    {
      provide: SourceComponent,
      useExisting: forwardRef(() => SourceRasterComponent),
    },
  ],
})
export class SourceRasterComponent
  extends SourceComponent
  implements AfterContentInit, AfterContentChecked, OnChanges
{
  operation = input<Operation>();
  threads = input<number>();
  lib = input<any>();
  operationType = input<'pixel' | 'image'>();
  resolutions = input<number[] | null>();
  beforeOperations = output<RasterSourceEvent>();
  afterOperations = output<RasterSourceEvent>();
  instance: Raster;
  protected readonly _instanceSignal = signal<Raster | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Raster): Raster {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }
  sources: Source[] = [];
  private sourceComponent?: SourceComponent;
  private lastSourceInstance?: Source;

  @ContentChild(SourceComponent, { static: false }) set source(
    sourceComponent: SourceComponent | undefined,
  ) {
    this.sourceComponent = sourceComponent;
    this.syncSourceInstance();
    if (this.instance) {
      // Openlayer doesn't handle sources update. Just recreate Raster instance.
      this.init();
    }
  }

  constructor(@Host() layer: LayerImageComponent) {
    super(layer);
  }

  ngAfterContentInit() {
    this.init();
  }

  ngAfterContentChecked() {
    const source = this.sourceComponent?.instance;

    if (source !== this.lastSourceInstance && this.instance) {
      this.syncSourceInstance(source);
      this.init();
      return;
    }

    this.lastSourceInstance = source;
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    const liveUpdateKeys: string[] = [];

    if (changes.operation?.currentValue) {
      liveUpdateKeys.push('operation', 'lib');
    }

    const requiresReload = this.hasReloadableChanges(changes, liveUpdateKeys);

    if (requiresReload && this.instance) {
      this.init();
      return;
    }

    if (this.instance && changes.operation?.currentValue) {
      this.instance.setOperation(changes.operation.currentValue, this.lib());
    }
  }

  init() {
    this.setInstance(new Raster(this.createOptions()));
    this.instance.on('beforeoperations', (event: RasterSourceEvent) =>
      this.beforeOperations.emit(event),
    );
    this.instance.on('afteroperations', (event: RasterSourceEvent) =>
      this.afterOperations.emit(event),
    );
    this.register(this.instance);
    this.lastSourceInstance = this.sourceComponent?.instance;
  }

  private syncSourceInstance(source = this.sourceComponent?.instance) {
    this.sources = source ? [source] : [];
    this.lastSourceInstance = source;
  }

  private createOptions(): Options {
    return {
      sources: this.sources,
      operation: this.operation(),
      threads: this.threads(),
      lib: this.lib(),
      operationType: this.operationType(),
      resolutions: this.resolutions(),
    };
  }
}
