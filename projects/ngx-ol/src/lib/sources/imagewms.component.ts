import {
  signal,
  Component,
  Host,
  OnChanges,
  OnInit,
  forwardRef,
  SimpleChanges,
  output,
  input,
} from '@angular/core';
import ImageWMS from 'ol/source/ImageWMS';
import { Options } from 'ol/source/ImageWMS';
import { LayerImageComponent } from '../layers/layerimage.component';
import { SourceComponent } from './source.component';
import { ProjectionLike } from 'ol/proj';
import { LoadFunction } from 'ol/Image';
import { ImageSourceEvent } from 'ol/source/Image';
import { ServerType } from 'ol/source/wms';

@Component({
  selector: 'aol-source-imagewms',
  template: ` <ng-content></ng-content> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceImageWMSComponent) }],
})
export class SourceImageWMSComponent extends SourceComponent implements OnChanges, OnInit {
  readonly crossOrigin = input<null | string>();
  readonly hidpi = input<boolean>();
  readonly serverType = input<ServerType>();
  readonly imageLoadFunction = input<LoadFunction>();
  readonly interpolate = input<boolean>();
  readonly params = input<{ [key: string]: any }>();
  readonly projection = input<ProjectionLike | string>();
  readonly ratio = input<number>();
  readonly resolutions = input<Array<number>>();
  readonly url = input<string>();
  readonly imageLoadStart = output<ImageSourceEvent>();
  readonly imageLoadEnd = output<ImageSourceEvent>();
  readonly imageLoadError = output<ImageSourceEvent>();
  instance: ImageWMS;
  protected readonly _instanceSignal = signal<ImageWMS | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: ImageWMS): ImageWMS {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(@Host() layer: LayerImageComponent) {
    super(layer);
  }

  ngOnInit() {
    this.setInstance(new ImageWMS(this.createOptions()));
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
    super.ngOnChanges(changes);
    const requiresReload = Object.keys(changes).some(
      (key) => key !== 'params' && !changes[key].firstChange,
    );

    if (requiresReload && this.instance) {
      this.reloadInstance();
      return;
    }

    if (this.instance && changes.hasOwnProperty('params')) {
      this.instance.updateParams(this.params());
    }
  }

  private reloadInstance() {
    this.setInstance(new ImageWMS(this.createOptions()));
    this.host.instance.setSource(this.instance);
    this.instance.on('imageloadstart', (event: ImageSourceEvent) =>
      this.imageLoadStart.emit(event),
    );
    this.instance.on('imageloadend', (event: ImageSourceEvent) => this.imageLoadEnd.emit(event));
    this.instance.on('imageloaderror', (event: ImageSourceEvent) =>
      this.imageLoadError.emit(event),
    );
  }

  private createOptions(): Options {
    return {
      attributions: this.attributions(),
      crossOrigin: this.crossOrigin(),
      hidpi: this.hidpi(),
      serverType: this.serverType(),
      imageLoadFunction: this.imageLoadFunction(),
      interpolate: this.interpolate(),
      params: this.params(),
      projection: this.projection(),
      ratio: this.ratio(),
      resolutions: this.resolutions(),
      url: this.url(),
    };
  }
}
