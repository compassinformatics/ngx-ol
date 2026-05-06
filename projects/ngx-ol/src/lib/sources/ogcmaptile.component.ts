import {
  AfterContentInit,
  Component,
  Host,
  OnChanges,
  SimpleChanges,
  forwardRef,
  signal,
  input,
} from '@angular/core';
import { ProjectionLike } from 'ol/proj';
import OGCMapTile from 'ol/source/OGCMapTile';
import { Options } from 'ol/source/OGCMapTile';
import { LoadFunction } from 'ol/Tile';
import { SourceComponent } from './source.component';
import { LayerTileComponent } from '../layers/layertile.component';

@Component({
  selector: 'aol-source-ogcmaptile',
  template: ` <ng-content></ng-content> `,
  providers: [
    { provide: SourceComponent, useExisting: forwardRef(() => SourceOGCMapTileComponent) },
  ],
})
export class SourceOGCMapTileComponent extends SourceComponent implements AfterContentInit, OnChanges {
  readonly url = input.required<string>();
  readonly context = input<any>();
  readonly mediaType = input<string>();
  readonly projection = input<ProjectionLike>();
  readonly cacheSize = input<number>();
  readonly crossOrigin = input<null | string>();
  readonly interpolate = input<boolean>();
  readonly reprojectionErrorThreshold = input<number>();
  readonly tileLoadFunction = input<LoadFunction>();
  readonly wrapX = input<boolean>();
  readonly transition = input<number>();
  readonly collections = input<string[]>();
  instance: OGCMapTile;
  protected readonly _instanceSignal = signal<OGCMapTile | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: OGCMapTile): OGCMapTile {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(@Host() layer: LayerTileComponent) {
    super(layer);
  }

  ngAfterContentInit() {
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
    this.setInstance(new OGCMapTile(this.createOptions()));
    this.host.instance.setSource(this.instance);
  }

  private createOptions(): Options {
    return {
      url: this.url(),
      context: this.context(),
      mediaType: this.mediaType(),
      projection: this.projection(),
      attributions: this.attributions(),
      cacheSize: this.cacheSize(),
      crossOrigin: this.crossOrigin(),
      interpolate: this.interpolate(),
      reprojectionErrorThreshold: this.reprojectionErrorThreshold(),
      tileLoadFunction: this.tileLoadFunction(),
      wrapX: this.wrapX(),
      transition: this.transition(),
      collections: this.collections(),
    };
  }
}
