import { Component, OnDestroy, OnInit, signal, input } from '@angular/core';
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
  attribution = input<boolean>();
  attributionOptions = input<AttributionOptions>();
  rotate = input<boolean>();
  rotateOptions = input<RotateOptions>();
  zoom = input<boolean>();
  zoomOptions = input<ZoomOptions>();

  instance: Collection<Control>;

  protected readonly _instanceSignal = signal<Collection<Control> | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Collection<Control>): Collection<Control> {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(private map: MapComponent) {}

  ngOnInit() {
    // console.log('ol.control.defaults init: ', this);
    this.setInstance(defaults(this.createOptions()));
    this.instance.forEach((c) => this.map.instance.addControl(c));
  }

  ngOnDestroy() {
    // console.log('removing aol-control-defaults');
    this.instance.forEach((c) => this.map.instance.removeControl(c));
  }

  private createOptions(): DefaultsOptions {
    return {
      attribution: this.attribution(),
      attributionOptions: this.attributionOptions(),
      rotate: this.rotate(),
      rotateOptions: this.rotateOptions(),
      zoom: this.zoom(),
      zoomOptions: this.zoomOptions(),
    };
  }
}
