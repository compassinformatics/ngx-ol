import {
  Component,
  forwardRef,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  input,
  output,
  signal,
  inject,
} from '@angular/core';
import ImageArcGISRest from 'ol/source/ImageArcGISRest';
import { Options } from 'ol/source/ImageArcGISRest';
import { LayerImageComponent } from '../layers/layerimage.component';
import { SourceComponent } from './source.component';
import { ProjectionLike } from 'ol/proj';
import { LoadFunction } from 'ol/Image';
import { ImageSourceEvent } from 'ol/source/Image';
import type { EventsKey } from 'ol/events';
import { unByKey } from 'ol/Observable';

@Component({
  selector: 'aol-source-imagearcgisrest',
  template: ` <ng-content></ng-content> `,
  providers: [
    { provide: SourceComponent, useExisting: forwardRef(() => SourceImageArcGISRestComponent) },
  ],
})
export class SourceImageArcGISRestComponent
  extends SourceComponent
  implements OnInit, OnChanges, OnDestroy
{
  readonly projection = input<ProjectionLike | string>();
  readonly url = input<string>();
  readonly crossOrigin = input<string | null>();
  readonly hidpi = input<boolean>();
  readonly imageLoadFunction = input<LoadFunction>();
  readonly interpolate = input<boolean>();
  readonly params = input<{ [k: string]: any }>();
  readonly ratio = input<number>(1.5);
  readonly resolutions = input<number[]>();

  readonly imageLoadStart = output<ImageSourceEvent>();
  readonly imageLoadEnd = output<ImageSourceEvent>();
  readonly imageLoadError = output<ImageSourceEvent>();

  instance: ImageArcGISRest;

  protected readonly _instanceSignal = signal<ImageArcGISRest | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  private eventKeys: EventsKey[] = [];

  protected setInstance(instance: ImageArcGISRest): ImageArcGISRest {
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

  private replaceInstance(): void {
    this.unbindInstanceEvents();
    this.setInstance(new ImageArcGISRest(this.createOptions()));
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
