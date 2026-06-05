import {
  AfterContentInit,
  Component,
  OnChanges,
  SimpleChanges,
  contentChild,
  forwardRef,
  input,
  output,
  signal,
  inject,
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

  protected readonly sourceComponent = contentChild(SourceComponent);

  constructor() {
    super(inject(LayerImageComponent, { host: true }));
  }

  ngAfterContentInit() {
    const sourceComponent = this.sourceComponent();

    if (sourceComponent) {
      this.sources = [sourceComponent.instance];
    }

    this.initializeInstance();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (this.instance && changes.operation?.currentValue) {
      this.instance.setOperation(changes.operation.currentValue, this.lib());
    }
  }

  initializeInstance() {
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
