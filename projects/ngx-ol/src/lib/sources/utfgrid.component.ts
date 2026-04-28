import { Component, Host, Input, OnInit, forwardRef } from '@angular/core';
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
export class SourceUTFGridComponent extends SourceComponent implements OnInit {
  @Input()
  preemptive?: boolean;
  @Input()
  jsonp?: boolean;
  @Input()
  tileJSON?: Config;
  @Input()
  url?: string;
  @Input()
  wrapX?: boolean;
  @Input()
  zDirection?: number | NearestDirectionFunction;

  instance: UTFGrid;

  constructor(@Host() layer: LayerTileComponent) {
    super(layer);
  }

  ngOnInit() {
    this.instance = new UTFGrid(this.createOptions());
    this.host.instance.setSource(this.instance);
  }

  private createOptions(): Options {
    return {
      preemptive: this.preemptive,
      jsonp: this.jsonp,
      tileJSON: this.tileJSON,
      url: this.url,
      wrapX: this.wrapX,
      zDirection: this.zDirection,
    };
  }
}
