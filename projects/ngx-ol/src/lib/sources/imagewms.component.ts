import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  forwardRef,
  SimpleChanges,
  input,
  output,
  signal,
  inject,
} from '@angular/core';
import ImageWMS from 'ol/source/ImageWMS';
import { Options } from 'ol/source/ImageWMS';
import { LayerImageComponent } from '../layers/layerimage.component';
import { SourceComponent } from './source.component';
import { ProjectionLike } from 'ol/proj';
import { LoadFunction } from 'ol/Image';
import { ImageSourceEvent } from 'ol/source/Image';
import { ServerType } from 'ol/source/wms';
import type { EventsKey } from 'ol/events';
import { unByKey } from 'ol/Observable';

@Component({
  selector: 'aol-source-imagewms',
  template: ` <ng-content></ng-content> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceImageWMSComponent) }],
})
export class SourceImageWMSComponent
  extends SourceComponent
  implements OnChanges, OnDestroy, OnInit
{
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

  private eventKeys: EventsKey[] = [];

  protected setInstance(instance: ImageWMS): ImageWMS {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  constructor() {
    super(inject(LayerImageComponent, { host: true }));
  }

  ngOnInit() {
    this.replaceInstance();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (!this.instance) {
      return;
    }

    if (this.hasRemovedParamKeys(changes)) {
      this.replaceInstance();
      return;
    }

    if (this.instance && changes.hasOwnProperty('params')) {
      this.instance.updateParams(this.params() ?? {});
    }
    if (this.instance && changes.imageLoadFunction?.currentValue) {
      this.instance.setImageLoadFunction(changes.imageLoadFunction.currentValue);
    }
    if (this.instance && changes.url) {
      this.instance.setUrl(changes.url.currentValue);
    }
    if (this.instance && changes.resolutions) {
      this.instance.setResolutions(changes.resolutions.currentValue);
    }
  }

  ngOnDestroy() {
    this.unbindInstanceEvents();
    super.ngOnDestroy();
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

  private replaceInstance(): void {
    this.unbindInstanceEvents();
    this.setInstance(new ImageWMS(this.createOptions()));
    this.host.instance.setSource(this.instance);
    this.bindInstanceEvents();
  }

  private bindInstanceEvents(): void {
    this.eventKeys = [
      this.instance.on('imageloadstart', (event: ImageSourceEvent) =>
        this.imageLoadStart.emit(event),
      ),
      this.instance.on('imageloadend', (event: ImageSourceEvent) => this.imageLoadEnd.emit(event)),
      this.instance.on('imageloaderror', (event: ImageSourceEvent) =>
        this.imageLoadError.emit(event),
      ),
    ];
  }

  private unbindInstanceEvents(): void {
    if (!this.eventKeys.length) {
      return;
    }

    unByKey(this.eventKeys);
    this.eventKeys = [];
  }

  private hasRemovedParamKeys(changes: SimpleChanges): boolean {
    if (!changes.params || changes.params.firstChange) {
      return false;
    }

    const previousParams = changes.params.previousValue ?? {};
    const nextParams = changes.params.currentValue ?? {};

    return Object.keys(previousParams).some(
      (key) => !Object.prototype.hasOwnProperty.call(nextParams, key),
    );
  }
}
