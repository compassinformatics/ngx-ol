import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  input,
  signal,
} from '@angular/core';
import MapEvent from 'ol/MapEvent';
import ZoomSlider from 'ol/control/ZoomSlider';
import { Options } from 'ol/control/ZoomSlider';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-control-zoomslider',
  template: ` <ng-content></ng-content> `,
})
export class ControlZoomSliderComponent implements OnInit, OnChanges, OnDestroy {
  className = input<string>();
  duration = input<number>();
  render = input<(event: MapEvent) => void>();
  target = input<string | HTMLElement>();

  instance: ZoomSlider;

  protected readonly _instanceSignal = signal<ZoomSlider | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: ZoomSlider): ZoomSlider {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  constructor(private map: MapComponent) {
    // console.log('instancing aol-control-zoomslider');
  }

  ngOnInit() {
    this.setInstance(new ZoomSlider(this.createOptions()));
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
    // console.log('removing aol-control-zoomslider');
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
      duration: this.duration(),
      render: this.render(),
      target: this.target(),
    };
  }
}
