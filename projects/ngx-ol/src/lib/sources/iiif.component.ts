import { Component, forwardRef, Host, OnInit, Optional, signal, input } from '@angular/core';
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
export class SourceIIIFComponent extends SourceComponent implements OnInit {
  cacheSize = input<number>();

  crossOrigin = input<string | null>();

  extent = input<Extent>();

  format = input<string>();

  interpolate = input<boolean>();

  projection = input<ProjectionLike>();

  quality = input<string>();

  reprojectionErrorThreshold = input<number>();

  resolutions = input<number[]>();

  size = input.required<Size>();

  sizes = input<Size[]>();

  state = input<State>();

  supports = input<string[]>();

  tilePixelRatio = input<number>();

  tileSize = input<number | Size>();

  transition = input<number>();

  url = input<string>();

  version = input<string>();

  zDirection = input<number | NearestDirectionFunction>();

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
