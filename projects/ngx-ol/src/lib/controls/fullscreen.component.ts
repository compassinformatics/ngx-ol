import { Component, OnDestroy, OnInit, signal, input } from '@angular/core';
import FullScreen from 'ol/control/FullScreen';
import { Options } from 'ol/control/FullScreen';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-control-fullscreen',
  template: ` <ng-content></ng-content> `,
})
export class ControlFullScreenComponent implements OnInit, OnDestroy {
  className = input<string>();
  label = input<string | HTMLElement | Text>();
  labelActive = input<string | HTMLElement | Text>();
  activeClassName = input<string>();
  inactiveClassName = input<string>();
  tipLabel = input<string>();
  keys = input<boolean>();
  target = input<string | HTMLElement>();
  source = input<string | HTMLElement>();

  instance: FullScreen;

  protected readonly _instanceSignal = signal<FullScreen | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: FullScreen): FullScreen {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(private map: MapComponent) {
    // console.log('instancing aol-control-fullscreen');
  }

  ngOnInit() {
    this.setInstance(new FullScreen(this.createOptions()));
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
    // console.log('removing aol-control-fullscreen');
    this.map.instance.removeControl(this.instance);
  }

  private createOptions(): Options {
    return {
      className: this.className(),
      label: this.label(),
      labelActive: this.labelActive(),
      activeClassName: this.activeClassName(),
      inactiveClassName: this.inactiveClassName(),
      tipLabel: this.tipLabel(),
      keys: this.keys(),
      target: this.target(),
      source: this.source(),
    };
  }
}
