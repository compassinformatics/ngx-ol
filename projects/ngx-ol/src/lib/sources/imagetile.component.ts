import {
  signal,
  Component,
  forwardRef,
  Host,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
  input,
} from '@angular/core';
import type { ProjectionLike } from 'ol/proj';
import type { Size } from 'ol/size';
import ImageTileSource from 'ol/source/ImageTile';
import type { CrossOriginAttribute } from 'ol/source/DataTile';
import type { Loader, Options, UrlLike } from 'ol/source/ImageTile';
import type { State } from 'ol/source/Source';
import TileGrid from 'ol/tilegrid/TileGrid';
import { LayerWebGLTileComponent } from '../layers/layerwebgltile.component';
import { SourceComponent } from './source.component';

@Component({
  selector: 'aol-source-imagetile',
  template: ` <ng-content></ng-content> `,
  providers: [
    { provide: SourceComponent, useExisting: forwardRef(() => SourceImageTileComponent) },
  ],
})
export class SourceImageTileComponent extends SourceComponent implements OnInit, OnChanges {
  readonly url = input<UrlLike>();
  readonly loader = input<Loader>();
  readonly maxZoom = input<number>();
  readonly minZoom = input<number>();
  readonly tileSize = input<number | Size>();
  readonly gutter = input<number>();
  readonly maxResolution = input<number>();
  readonly projection = input<ProjectionLike>();
  readonly tileGrid = input<TileGrid>();
  readonly state = input<State>();
  readonly wrapX = input<boolean>();
  readonly transition = input<number>();
  readonly interpolate = input<boolean>();
  readonly crossOrigin = input<CrossOriginAttribute>();
  instance: ImageTileSource;
  protected readonly _instanceSignal = signal<ImageTileSource | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: ImageTileSource): ImageTileSource {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(@Optional() @Host() layer?: LayerWebGLTileComponent) {
    super(layer!);
  }

  ngOnInit() {
    this.setInstance(new ImageTileSource(this.createOptions()));
    this.register(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    const requiresReload = Object.keys(changes).some(
      (key) => key !== 'url' && !changes[key].firstChange,
    );

    if (requiresReload && this.instance) {
      this.reloadInstance();
      return;
    }

    if (this.instance && changes.url?.currentValue) {
      this.instance.setUrl(changes.url.currentValue);
    }
  }

  private reloadInstance() {
    this.setInstance(new ImageTileSource(this.createOptions()));
    this.register(this.instance);
  }

  private createOptions(): Options {
    return {
      url: this.url(),
      loader: this.loader(),
      attributions: this.attributions(),
      attributionsCollapsible: this.attributionsCollapsible(),
      maxZoom: this.maxZoom(),
      minZoom: this.minZoom(),
      tileSize: this.tileSize(),
      gutter: this.gutter(),
      maxResolution: this.maxResolution(),
      projection: this.projection(),
      tileGrid: this.tileGrid(),
      state: this.state(),
      wrapX: this.wrapX(),
      transition: this.transition(),
      interpolate: this.interpolate(),
      crossOrigin: this.crossOrigin(),
    };
  }
}
