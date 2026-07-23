import { Component, OnInit, forwardRef, input, signal, inject } from '@angular/core';
import { SourceComponent } from './source.component';
import { LayerTileComponent } from '../layers/layertile.component';
import UTFGrid from 'ol/source/UTFGrid.js';
import { Config } from 'ol/source/TileJSON.js';
import { Options } from 'ol/source/UTFGrid.js';
import { NearestDirectionFunction } from 'ol/array.js';

@Component({
  selector: 'aol-source-utfgrid',
  template: ` <ng-content></ng-content> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceUTFGridComponent) }],
})
export class SourceUTFGridComponent extends SourceComponent implements OnInit {
  readonly preemptive = input<boolean>();
  readonly jsonp = input<boolean>();
  readonly tileJSON = input<Config>();
  readonly url = input<string>();
  readonly wrapX = input<boolean>();
  readonly zDirection = input<number | NearestDirectionFunction>();

  instance: UTFGrid;

  protected readonly _instanceSignal = signal<UTFGrid | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: UTFGrid): UTFGrid {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  constructor() {
    super(inject(LayerTileComponent, { host: true }));
  }

  ngOnInit() {
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
