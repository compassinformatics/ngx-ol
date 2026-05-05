import {
  signal,
  Component,
  EventEmitter,
  forwardRef,
  Host,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  input,
} from '@angular/core';
import ImageArcGISRest from 'ol/source/ImageArcGISRest';
import { Options } from 'ol/source/ImageArcGISRest';
import { LayerImageComponent } from '../layers/layerimage.component';
import { SourceComponent } from './source.component';
import { ProjectionLike } from 'ol/proj';
import { LoadFunction } from 'ol/Image';
import { ImageSourceEvent } from 'ol/source/Image';

@Component({
  selector: 'aol-source-imagearcgisrest',
  template: ` <ng-content></ng-content> `,
  providers: [
    { provide: SourceComponent, useExisting: forwardRef(() => SourceImageArcGISRestComponent) },
  ],
})
export class SourceImageArcGISRestComponent extends SourceComponent implements OnInit, OnChanges {
  projection = input<ProjectionLike | string>();
  url = input<string>();
  crossOrigin = input<string | null>();
  hidpi = input<boolean>();
  imageLoadFunction = input<LoadFunction>();
  interpolate = input<boolean>();
  params = input<{ [k: string]: any }>();
  ratio = input<number>(1.5);
  resolutions = input<number[]>();

  @Output() imageLoadStart = new EventEmitter<ImageSourceEvent>();
  @Output() imageLoadEnd = new EventEmitter<ImageSourceEvent>();
  @Output() imageLoadError = new EventEmitter<ImageSourceEvent>();

  instance: ImageArcGISRest;

  protected readonly _instanceSignal = signal<ImageArcGISRest | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: ImageArcGISRest): ImageArcGISRest {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(@Host() layer: LayerImageComponent) {
    super(layer);
  }

  ngOnInit() {
    this.setInstance(new ImageArcGISRest(this.createOptions()));
    this.host.instance.setSource(this.instance);
    this.instance.on('imageloadstart', (event: ImageSourceEvent) =>
      this.imageLoadStart.emit(event),
    );
    this.instance.on('imageloadend', (event: ImageSourceEvent) => this.imageLoadEnd.emit(event));
    this.instance.on('imageloaderror', (event: ImageSourceEvent) =>
      this.imageLoadError.emit(event),
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.instance && changes.hasOwnProperty('params')) {
      this.instance.updateParams(this.params());
    }
  }

  private createOptions(): Options {
    return {
      attributions: this.attributions(),
      projection: this.projection(),
      url: this.url(),
      crossOrigin: this.crossOrigin(),
      hidpi: this.hidpi(),
      imageLoadFunction: this.imageLoadFunction(),
      interpolate: this.interpolate(),
      params: this.params(),
      ratio: this.ratio(),
      resolutions: this.resolutions(),
    };
  }
}
