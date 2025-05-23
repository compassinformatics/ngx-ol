import { Component, Host, Input, OnInit, forwardRef } from '@angular/core';
import { SourceComponent } from './source.component';
import { LayerTileComponent } from '../layers/layertile.component';
import { UTFGrid } from 'ol/source';
import { Config } from 'ol/source/TileJSON';

@Component({
  selector: 'aol-source-utfgrid',
  template: ` <ng-content></ng-content> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceUTFGridComponent) }],
})
export class SourceUTFGridComponent extends SourceComponent implements OnInit {
  @Input() tileJSON?: Config;
  @Input() url?: string;

  instance: UTFGrid;

  constructor(@Host() layer: LayerTileComponent) {
    super(layer);
  }

  ngOnInit() {
    this.instance = new UTFGrid(this);
    this.host.instance.setSource(this.instance);
  }
}
