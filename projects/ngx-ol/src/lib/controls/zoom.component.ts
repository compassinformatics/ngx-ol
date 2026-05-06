import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, signal, input } from '@angular/core';
import Zoom from 'ol/control/Zoom';
import { Options } from 'ol/control/Zoom';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-control-zoom',
  template: ` <ng-content></ng-content> `,
})
export class ControlZoomComponent implements OnInit, OnChanges, OnDestroy {
  duration = input<number>();
  className = input<string>();
  zoomInClassName = input<string>();
  zoomOutClassName = input<string>();
  zoomInLabel = input<string | HTMLElement>();
  zoomOutLabel = input<string | HTMLElement>();
  zoomInTipLabel = input<string>();
  zoomOutTipLabel = input<string>();
  delta = input<number>();
  target = input<string | HTMLElement>();

  instance: Zoom;

  protected readonly _instanceSignal = signal<Zoom | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Zoom): Zoom {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(private map: MapComponent) {
    // console.log('instancing aol-control-zoom');
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
    // console.log('removing aol-control-zoom');
    this.map.instance.removeControl(this.instance);
  }

  private initializeInstance() {
    this.setInstance(new Zoom(this.createOptions()));
    this.map.instance.addControl(this.instance);
  }

  private reloadInstance() {
    this.map.instance.removeControl(this.instance);
    this.initializeInstance();
  }

  private createOptions(): Options {
    return {
      duration: this.duration(),
      className: this.className(),
      zoomInClassName: this.zoomInClassName(),
      zoomOutClassName: this.zoomOutClassName(),
      zoomInLabel: this.zoomInLabel(),
      zoomOutLabel: this.zoomOutLabel(),
      zoomInTipLabel: this.zoomInTipLabel(),
      zoomOutTipLabel: this.zoomOutTipLabel(),
      delta: this.delta(),
      target: this.target(),
    };
  }
}
