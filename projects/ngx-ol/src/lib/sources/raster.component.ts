import {
  signal,
  AfterContentInit,
  Component,
  ContentChild,
  EventEmitter,
  forwardRef,
  Host,
  Output,
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
export class SourceRasterComponent extends SourceComponent implements AfterContentInit {
  operation = input<Operation>();
  threads = input<number>();
  lib = input<any>();
  operationType = input<'pixel' | 'image'>();
  resolutions = input<number[] | null>();

  @Output() beforeOperations = new EventEmitter<RasterSourceEvent>();
  @Output() afterOperations = new EventEmitter<RasterSourceEvent>();

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
