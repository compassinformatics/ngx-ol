import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, signal, input } from '@angular/core';
import ZoomToExtent from 'ol/control/ZoomToExtent';
import { Options } from 'ol/control/ZoomToExtent';
import { MapComponent } from '../map.component';
import { Extent } from 'ol/extent';

@Component({
  selector: 'aol-control-zoomtoextent',
  template: ` <ng-content></ng-content> `,
})
export class ControlZoomToExtentComponent implements OnInit, OnChanges, OnDestroy {
  className = input<string>();
  target = input<string | HTMLElement>();
  label = input<string | HTMLElement>();
  tipLabel = input<string>();
  extent = input<Extent>();

  instance: ZoomToExtent;

  protected readonly _instanceSignal = signal<ZoomToExtent | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: ZoomToExtent): ZoomToExtent {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(private map: MapComponent) {
    // console.log('instancing aol-control-zoomtoextent');
  }

  ngOnInit() {
    this.initializeInstance();
  }

  ngOnChanges(changes: SimpleChanges) {
    const requiresReload = Object.keys(changes).some((key) => !changes[key].firstChange);

    if (requiresReload && this.instance) {
      this.reloadInstance();
    }
  }

  ngOnDestroy() {
    // console.log('removing aol-control-zoomtoextent');
    this.map.instance.removeControl(this.instance);
  }

  private initializeInstance() {
    this.setInstance(new ZoomToExtent(this.createOptions()));
    this.map.instance.addControl(this.instance);
  }

  private reloadInstance() {
    this.map.instance.removeControl(this.instance);
    this.initializeInstance();
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
