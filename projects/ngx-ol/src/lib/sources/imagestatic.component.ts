import {
  Component,
  forwardRef,
  OnChanges,
  SimpleChanges,
  OnInit,
  input,
  output,
  signal,
  inject,
} from '@angular/core';
import ImageStatic from 'ol/source/ImageStatic';
import { Options } from 'ol/source/ImageStatic';
import { SourceComponent } from './source.component';
import { LayerImageComponent } from '../layers/layerimage.component';
import { ProjectionLike } from 'ol/proj';
import { Extent } from 'ol/extent';
import { LoadFunction } from 'ol/Image';
import { ImageSourceEvent } from 'ol/source/Image';

@Component({
  selector: 'aol-source-imagestatic',
  template: ` <ng-content></ng-content> `,
  providers: [
    { provide: SourceComponent, useExisting: forwardRef(() => SourceImageStaticComponent) },
  ],
})
export class SourceImageStaticComponent extends SourceComponent implements OnInit, OnChanges {
  readonly projection = input<ProjectionLike | string>();
  readonly imageExtent = input.required<Extent>();
  readonly url = input.required<string>();
  readonly crossOrigin = input<null | string>();
  readonly imageLoadFunction = input<LoadFunction>();
  readonly interpolate = input<boolean>();

  readonly imageLoadStart = output<ImageSourceEvent>();
  readonly imageLoadEnd = output<ImageSourceEvent>();
  readonly imageLoadError = output<ImageSourceEvent>();

  instance: ImageStatic;

  protected readonly _instanceSignal = signal<ImageStatic | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: ImageStatic): ImageStatic {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  constructor() {
    super(inject(LayerImageComponent, { host: true }));
  }

  private replaceInstance(): void {
    this.setInstance(new ImageStatic(this.createOptions()));
    this.host.instance.setSource(this.instance);
    this.instance.on('imageloadstart', (event: ImageSourceEvent) =>
      this.imageLoadStart.emit(event),
    );
    this.instance.on('imageloadend', (event: ImageSourceEvent) => this.imageLoadEnd.emit(event));
    this.instance.on('imageloaderror', (event: ImageSourceEvent) =>
      this.imageLoadError.emit(event),
    );
  }

  ngOnInit() {
    this.replaceInstance();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.instance) {
      return;
    }
    super.ngOnChanges(changes);
    for (const key in changes) {
      if (changes.hasOwnProperty(key)) {
        switch (key) {
          case 'url':
            this.replaceInstance();
            break;
          default:
            break;
        }
      }
    }
  }

  private createOptions(): Options {
    return {
      attributions: this.attributions(),
      projection: this.projection(),
      imageExtent: this.imageExtent(),
      url: this.url(),
      crossOrigin: this.crossOrigin(),
      imageLoadFunction: this.imageLoadFunction(),
      interpolate: this.interpolate(),
    };
  }
}
