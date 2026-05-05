import {
  signal,
  Component,
  Host,
  Input,
  forwardRef,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
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
  @Input() projection?: ProjectionLike | string;
  @Input() imageExtent: Extent;
  @Input() url: string;
  @Input() crossOrigin?: null | string;
  @Input() imageLoadFunction?: LoadFunction;
  @Input() interpolate?: boolean;

  @Output() imageLoadStart = new EventEmitter<ImageSourceEvent>();
  @Output() imageLoadEnd = new EventEmitter<ImageSourceEvent>();
  @Output() imageLoadError = new EventEmitter<ImageSourceEvent>();

  instance: ImageStatic;

  protected readonly _instanceSignal = signal<ImageStatic | undefined>(
    undefined,
  );

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: ImageStatic): ImageStatic {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(@Host() layer: LayerImageComponent) {
    super(layer);
  }

  setLayerSource(): void {
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
    this.setLayerSource();
  }

  ngOnChanges(changes: SimpleChanges) {
    const properties: { [index: string]: any } = {};
    if (!this.instance) {
      return;
    }
    for (const key in changes) {
      if (changes.hasOwnProperty(key)) {
        switch (key) {
          case 'url':
            this.url = changes[key].currentValue;
            this.setLayerSource();
            break;
          default:
            break;
        }
        properties[key] = changes[key].currentValue;
      }
    }
    this.instance.setProperties(properties, false);
  }

  private createOptions(): Options {
    return {
      attributions: this.attributions,
      projection: this.projection,
      imageExtent: this.imageExtent,
      url: this.url,
      crossOrigin: this.crossOrigin,
      imageLoadFunction: this.imageLoadFunction,
      interpolate: this.interpolate,
    };
  }
}
