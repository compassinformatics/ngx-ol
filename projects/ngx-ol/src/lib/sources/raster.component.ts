import {
  signal,
  AfterContentInit,
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
export class SourceRasterComponent extends SourceComponent implements AfterContentInit, OnChanges {
  readonly operation = input<Operation>();
  readonly threads = input<number>();
  readonly lib = input<any>();
  readonly operationType = input<'pixel' | 'image'>();
  readonly resolutions = input<number[] | null>();
  readonly beforeOperations = output<RasterSourceEvent>();
  readonly afterOperations = output<RasterSourceEvent>();
  instance: Raster;
  protected readonly _instanceSignal = signal<Raster | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Raster): Raster {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }
  sources: Source[] = [];

  @ContentChild(SourceComponent, { static: false }) set source(sourceComponent: SourceComponent) {
    this.sources = [sourceComponent.instance];
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

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    const requiresReload = Object.keys(changes).some((key) => !changes[key].firstChange);

    if (requiresReload && this.instance) {
      this.init();
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
