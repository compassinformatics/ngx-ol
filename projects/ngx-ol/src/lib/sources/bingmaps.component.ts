import { Component, Host, OnChanges, OnInit, SimpleChanges, forwardRef, signal, input } from '@angular/core';
import BingMaps from 'ol/source/BingMaps';
import { Options } from 'ol/source/BingMaps';
import { SourceComponent } from './source.component';
import { LayerTileComponent } from '../layers/layertile.component';
import { LoadFunction } from 'ol/Tile';
import { NearestDirectionFunction } from 'ol/array';

@Component({
  selector: 'aol-source-bingmaps',
  template: ` <div class="aol-source-bingmaps"></div> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceBingmapsComponent) }],
})
export class SourceBingmapsComponent extends SourceComponent implements OnInit, OnChanges {
  readonly cacheSize = input<number>();
  readonly hidpi = input<boolean>();
  readonly culture = input<string>();
  readonly key = input.required<string>();
  readonly imagerySet = input<'Road' | 'Aerial' | 'AerialWithLabels' | 'collinsBart' | 'ordnanceSurvey'>(
    'Aerial',
  );
  readonly maxZoom = input<number>();
  readonly reprojectionErrorThreshold = input<number>();
  readonly tileLoadFunction = input<LoadFunction>();
  readonly wrapX = input<boolean>();
  readonly interpolate = input<boolean>();
  readonly placeholderTiles = input<boolean>();
  readonly transition = input<number>();
  readonly zDirection = input<number | NearestDirectionFunction>();
  instance: BingMaps;
  protected readonly _instanceSignal = signal<BingMaps | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: BingMaps): BingMaps {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(@Host() layer: LayerTileComponent) {
    super(layer);
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
    this.setInstance(new BingMaps(this.createOptions()));
    this.host.instance.setSource(this.instance);
  }

  private createOptions(): Options {
    return {
      cacheSize: this.cacheSize(),
      hidpi: this.hidpi(),
      culture: this.culture(),
      key: this.key(),
      imagerySet: this.imagerySet(),
      maxZoom: this.maxZoom(),
      reprojectionErrorThreshold: this.reprojectionErrorThreshold(),
      tileLoadFunction: this.tileLoadFunction(),
      wrapX: this.wrapX(),
      interpolate: this.interpolate(),
      placeholderTiles: this.placeholderTiles(),
      transition: this.transition(),
      zDirection: this.zDirection(),
    };
  }
}
