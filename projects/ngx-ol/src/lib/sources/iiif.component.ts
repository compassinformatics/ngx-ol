import {
  Component,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
  forwardRef,
  Host,
  signal,
  input,
} from '@angular/core';
import type { NearestDirectionFunction } from 'ol/array';
import type { Extent } from 'ol/extent';
import type { ProjectionLike } from 'ol/proj';
import type { Size } from 'ol/size';
import IIIF from 'ol/source/IIIF';
import type { Options } from 'ol/source/IIIF';
import type { State } from 'ol/source/Source';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceComponent } from './source.component';

@Component({
  selector: 'aol-source-iiif',
  template: '',
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceIIIFComponent) }],
})
export class SourceIIIFComponent extends SourceComponent implements OnInit, OnChanges {
  readonly cacheSize = input<number>();
  readonly crossOrigin = input<string | null>();
  readonly extent = input<Extent>();
  readonly format = input<string>();
  readonly interpolate = input<boolean>();
  readonly projection = input<ProjectionLike>();
  readonly quality = input<string>();
  readonly reprojectionErrorThreshold = input<number>();
  readonly resolutions = input<number[]>();
  readonly size = input.required<Size>();
  readonly sizes = input<Size[]>();
  readonly state = input<State>();
  readonly supports = input<string[]>();
  readonly tilePixelRatio = input<number>();
  readonly tileSize = input<number | Size>();
  readonly transition = input<number>();
  readonly url = input<string>();
  readonly version = input<string>();
  readonly zDirection = input<number | NearestDirectionFunction>();
  instance: IIIF;
  protected readonly _instanceSignal = signal<IIIF | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: IIIF): IIIF {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(@Optional() @Host() layer?: LayerTileComponent) {
    super(layer!);
  }

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    const requiresReload = Object.keys(changes).some((key) => !changes[key].firstChange);

    if (requiresReload && this.instance) {
      this.init();
    }
  }

  private init() {
    this.setInstance(new IIIF(this.createOptions()));
    this.register(this.instance);
  }

  private createOptions(): Options {
    return {
      attributions: this.attributions(),
      attributionsCollapsible: this.attributionsCollapsible(),
      cacheSize: this.cacheSize(),
      crossOrigin: this.crossOrigin(),
      extent: this.extent(),
      format: this.format(),
      interpolate: this.interpolate(),
      projection: this.projection(),
      quality: this.quality(),
      reprojectionErrorThreshold: this.reprojectionErrorThreshold(),
      resolutions: this.resolutions(),
      size: this.size(),
      sizes: this.sizes(),
      state: this.state(),
      supports: this.supports(),
      tilePixelRatio: this.tilePixelRatio(),
      tileSize: this.tileSize(),
      transition: this.transition(),
      url: this.url(),
      version: this.version(),
      zDirection: this.zDirection(),
    };
  }
}
