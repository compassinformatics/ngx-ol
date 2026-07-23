import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  input,
  signal,
} from '@angular/core';
import ZoomToExtent from 'ol/control/ZoomToExtent.js';
import { Options } from 'ol/control/ZoomToExtent.js';
import { MapComponent } from '../map.component';
import { Extent } from 'ol/extent.js';

@Component({
  selector: 'aol-control-zoomtoextent',
  template: ` <ng-content></ng-content> `,
})
export class ControlZoomToExtentComponent implements OnInit, OnChanges, OnDestroy {
  readonly className = input<string>();
  readonly target = input<string | HTMLElement>();
  readonly label = input<string | HTMLElement>();
  readonly tipLabel = input<string>();
  readonly extent = input<Extent>();

  instance: ZoomToExtent;

  protected readonly _instanceSignal = signal<ZoomToExtent | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: ZoomToExtent): ZoomToExtent {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  constructor(private readonly map: MapComponent) {
    // console.log('instancing aol-control-zoomtoextent');
  }

  ngOnInit() {
    this.setInstance(new ZoomToExtent(this.createOptions()));
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
    // console.log('removing aol-control-zoomtoextent');
    this.map.instance.removeControl(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.instance && changes.target?.currentValue !== undefined) {
      this.instance.setTarget(changes.target.currentValue);
    }
  }

  private createOptions(): Options {
    return {
      className: this.className(),
      target: this.target(),
      label: this.label(),
      tipLabel: this.tipLabel(),
      extent: this.extent(),
    };
  }
}
