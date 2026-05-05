import { Component, forwardRef, Host, Input, OnInit, Optional, signal } from '@angular/core';
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
export class SourceZoomifyComponent extends SourceComponent implements OnInit {
  @Input() cacheSize?: number;

  @Input() crossOrigin?: string | null;

  @Input() interpolate?: boolean;

  @Input() projection?: ProjectionLike;

  @Input() tilePixelRatio?: number;

  @Input() reprojectionErrorThreshold?: number;

  @Input() url!: string;

  @Input() tierSizeCalculation?: TierSizeCalculation;

  @Input() size!: Size;

  @Input() extent?: Extent;

  @Input() transition?: number;

  @Input() tileSize?: number;

  @Input() zDirection?: number | NearestDirectionFunction;

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
    this.setInstance(new Zoomify(this.createOptions()));
    this.register(this.instance);
  }

  private createOptions(): Options {
    return {
      attributions: this.attributions,
      cacheSize: this.cacheSize,
      crossOrigin: this.crossOrigin,
      interpolate: this.interpolate,
      projection: this.projection,
      tilePixelRatio: this.tilePixelRatio,
      reprojectionErrorThreshold: this.reprojectionErrorThreshold,
      url: this.url,
      tierSizeCalculation: this.tierSizeCalculation,
      size: this.size,
      extent: this.extent,
      transition: this.transition,
      tileSize: this.tileSize,
      zDirection: this.zDirection,
    };
  }
}
