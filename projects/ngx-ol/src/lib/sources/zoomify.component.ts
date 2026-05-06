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
import Zoomify from 'ol/source/Zoomify';
import type { Options, TierSizeCalculation } from 'ol/source/Zoomify';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceComponent } from './source.component';

@Component({
  selector: 'aol-source-zoomify',
  template: ` <ng-content></ng-content> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceZoomifyComponent) }],
})
export class SourceZoomifyComponent extends SourceComponent implements OnInit, OnChanges {
  readonly cacheSize = input<number>();
  readonly crossOrigin = input<string | null>();
  readonly interpolate = input<boolean>();
  readonly projection = input<ProjectionLike>();
  readonly tilePixelRatio = input<number>();
  readonly reprojectionErrorThreshold = input<number>();
  readonly url = input.required<string>();
  readonly tierSizeCalculation = input<TierSizeCalculation>();
  readonly size = input.required<Size>();
  readonly extent = input<Extent>();
  readonly transition = input<number>();
  readonly tileSize = input<number>();
  readonly zDirection = input<number | NearestDirectionFunction>();
  instance: Zoomify;
  protected readonly _instanceSignal = signal<Zoomify | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Zoomify): Zoomify {
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
    this.setInstance(new Zoomify(this.createOptions()));
    this.register(this.instance);
  }

  private createOptions(): Options {
    return {
      attributions: this.attributions(),
      cacheSize: this.cacheSize(),
      crossOrigin: this.crossOrigin(),
      interpolate: this.interpolate(),
      projection: this.projection(),
      tilePixelRatio: this.tilePixelRatio(),
      reprojectionErrorThreshold: this.reprojectionErrorThreshold(),
      url: this.url(),
      tierSizeCalculation: this.tierSizeCalculation(),
      size: this.size(),
      extent: this.extent(),
      transition: this.transition(),
      tileSize: this.tileSize(),
      zDirection: this.zDirection(),
    };
  }
}
