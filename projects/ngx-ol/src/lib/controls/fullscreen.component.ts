import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  input,
  signal,
} from '@angular/core';
import FullScreen from 'ol/control/FullScreen';
import { Options } from 'ol/control/FullScreen';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-control-fullscreen',
  template: ` <ng-content></ng-content> `,
})
export class ControlFullScreenComponent implements OnInit, OnChanges, OnDestroy {
  readonly className = input<string>();
  readonly label = input<string | HTMLElement | Text>();
  readonly labelActive = input<string | HTMLElement | Text>();
  readonly activeClassName = input<string>();
  readonly inactiveClassName = input<string>();
  readonly tipLabel = input<string>();
  readonly keys = input<boolean>();
  readonly target = input<string | HTMLElement>();
  readonly source = input<string | HTMLElement>();

  instance: FullScreen;

  protected readonly _instanceSignal = signal<FullScreen | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: FullScreen): FullScreen {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  constructor(private readonly map: MapComponent) {
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

  ngOnChanges(changes: SimpleChanges) {
    if (this.instance && changes.target?.currentValue !== undefined) {
      this.instance.setTarget(changes.target.currentValue);
    }
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
