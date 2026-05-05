import {
  Component,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
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
  @Input() projection?: ProjectionLike | string;
  @Input() url?: string;
  @Input() crossOrigin?: string | null;
  @Input() hidpi?: boolean;
  @Input() imageLoadFunction?: LoadFunction;
  @Input() interpolate?: boolean;
  @Input() params?: { [k: string]: any };
  @Input() ratio?: number = 1.5;
  @Input() resolutions?: number[];

  @Output() imageLoadStart = new EventEmitter<ImageSourceEvent>();
  @Output() imageLoadEnd = new EventEmitter<ImageSourceEvent>();
  @Output() imageLoadError = new EventEmitter<ImageSourceEvent>();

  instance: ImageArcGISRest;

  constructor(@Host() layer: LayerImageComponent) {
    super(layer);
  }

  ngOnInit() {
    this.instance = new ImageArcGISRest(this.createOptions());
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
      this.instance.updateParams(this.params);
    }
  }

  private createOptions(): Options {
    return {
      attributions: this.attributions,
      projection: this.projection,
      url: this.url,
      crossOrigin: this.crossOrigin,
      hidpi: this.hidpi,
      imageLoadFunction: this.imageLoadFunction,
      interpolate: this.interpolate,
      params: this.params,
      ratio: this.ratio,
      resolutions: this.resolutions,
    };
  }
}
