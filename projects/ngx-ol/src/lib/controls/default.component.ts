import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import Control from 'ol/control/Control';
import { defaults } from 'ol/control/defaults';
import { DefaultsOptions } from 'ol/control/defaults';
import Collection from 'ol/Collection';
import { Options as AttributionOptions } from 'ol/control/Attribution';
import { Options as RotateOptions } from 'ol/control/Rotate';
import { Options as ZoomOptions } from 'ol/control/Zoom';

import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-control-defaults',
  template: '',
})
export class DefaultControlComponent implements OnInit, OnDestroy {
  @Input() attribution?: boolean;
  @Input() attributionOptions?: AttributionOptions;
  @Input() rotate?: boolean;
  @Input() rotateOptions?: RotateOptions;
  @Input() zoom?: boolean;
  @Input() zoomOptions?: ZoomOptions;

  instance: Collection<Control>;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    // console.log('ol.control.defaults init: ', this);
    this.instance = defaults(this.createOptions());
    this.instance.forEach((c) => this.map.instance.addControl(c));
  }

  ngOnDestroy() {
    // console.log('removing aol-control-defaults');
    this.instance.forEach((c) => this.map.instance.removeControl(c));
  }

  private createOptions(): DefaultsOptions {
    return {
      attribution: this.attribution,
      attributionOptions: this.attributionOptions,
      rotate: this.rotate,
      rotateOptions: this.rotateOptions,
      zoom: this.zoom,
      zoomOptions: this.zoomOptions,
    };
  }
}
