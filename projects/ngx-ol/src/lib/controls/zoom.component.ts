import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  input,
  signal,
} from '@angular/core';
import Zoom from 'ol/control/Zoom.js';
import { Options } from 'ol/control/Zoom.js';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-control-zoom',
  template: ` <ng-content></ng-content> `,
})
export class ControlZoomComponent implements OnInit, OnChanges, OnDestroy {
  readonly duration = input<number>();
  readonly className = input<string>();
  readonly zoomInClassName = input<string>();
  readonly zoomOutClassName = input<string>();
  readonly zoomInLabel = input<string | HTMLElement>();
  readonly zoomOutLabel = input<string | HTMLElement>();
  readonly zoomInTipLabel = input<string>();
  readonly zoomOutTipLabel = input<string>();
  readonly delta = input<number>();
  readonly target = input<string | HTMLElement>();

  instance: Zoom;

  protected readonly _instanceSignal = signal<Zoom | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Zoom): Zoom {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  constructor(private readonly map: MapComponent) {
    // console.log('instancing aol-control-zoom');
  }

  ngOnInit() {
    this.setInstance(new Zoom(this.createOptions()));
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
    // console.log('removing aol-control-zoom');
    this.map.instance.removeControl(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.instance && changes.target?.currentValue !== undefined) {
      this.instance.setTarget(changes.target.currentValue);
    }
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
