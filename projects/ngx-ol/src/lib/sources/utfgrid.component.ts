import { Component, Host, OnChanges, OnInit, SimpleChanges, forwardRef, signal, input } from '@angular/core';
import { SourceComponent } from './source.component';
import { LayerTileComponent } from '../layers/layertile.component';
import UTFGrid from 'ol/source/UTFGrid';
import { Config } from 'ol/source/TileJSON';
import { Options } from 'ol/source/UTFGrid';
import { NearestDirectionFunction } from 'ol/array';

@Component({
  selector: 'aol-source-utfgrid',
  template: ` <ng-content></ng-content> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceUTFGridComponent) }],
})
export class SourceUTFGridComponent extends SourceComponent implements OnInit, OnChanges {
  preemptive = input<boolean>();
  jsonp = input<boolean>();
  tileJSON = input<Config>();
  url = input<string>();
  wrapX = input<boolean>();
  zDirection = input<number | NearestDirectionFunction>();
  instance: UTFGrid;
  protected readonly _instanceSignal = signal<UTFGrid | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: UTFGrid): UTFGrid {
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
    this.setInstance(new UTFGrid(this.createOptions()));
    this.host.instance.setSource(this.instance);
  }

  private createOptions(): Options {
    return {
      preemptive: this.preemptive(),
      jsonp: this.jsonp(),
      tileJSON: this.tileJSON(),
      url: this.url(),
      wrapX: this.wrapX(),
      zDirection: this.zDirection(),
    };
  }
}
