import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, signal, input } from '@angular/core';
import MapEvent from 'ol/MapEvent';
import ZoomSlider from 'ol/control/ZoomSlider';
import { Options } from 'ol/control/ZoomSlider';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-control-zoomslider',
  template: ` <ng-content></ng-content> `,
})
export class ControlZoomSliderComponent implements OnInit, OnChanges, OnDestroy {
  readonly className = input<string>();
  readonly duration = input<number>();
  readonly render = input<(event: MapEvent) => void>();
  readonly target = input<string | HTMLElement>();
  instance: ZoomSlider;
  protected readonly _instanceSignal = signal<ZoomSlider | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: ZoomSlider): ZoomSlider {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(private readonly map: MapComponent) {
    // console.log('instancing aol-control-zoomslider');
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
    // console.log('removing aol-control-zoomslider');
    this.map.instance.removeControl(this.instance);
  }

  private initializeInstance() {
    this.setInstance(new ZoomSlider(this.createOptions()));
    this.map.instance.addControl(this.instance);
  }

  private reloadInstance() {
    this.map.instance.removeControl(this.instance);
    this.initializeInstance();
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
