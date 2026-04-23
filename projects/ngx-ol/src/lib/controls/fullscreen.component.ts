import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FullScreen } from 'ol/control';
import { Options } from 'ol/control/FullScreen';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-control-fullscreen',
  template: ` <ng-content></ng-content> `,
})
export class ControlFullScreenComponent implements OnInit, OnDestroy {
  @Input()
  className: string;
  @Input()
  label: string | HTMLElement | Text;
  @Input()
  labelActive: string | HTMLElement | Text;
  @Input()
  activeClassName: string;
  @Input()
  inactiveClassName: string;
  @Input()
  tipLabel: string;
  @Input()
  keys: boolean;
  @Input()
  target: string | HTMLElement;
  @Input()
  source: string | HTMLElement;

  instance: FullScreen;

  constructor(private map: MapComponent) {
    // console.log('instancing aol-control-fullscreen');
  }

  ngOnInit() {
    this.instance = new FullScreen(this.createOptions());
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
    // console.log('removing aol-control-fullscreen');
    this.map.instance.removeControl(this.instance);
  }

  private createOptions(): Options {
    return {
      className: this.className,
      label: this.label,
      labelActive: this.labelActive,
      activeClassName: this.activeClassName,
      inactiveClassName: this.inactiveClassName,
      tipLabel: this.tipLabel,
      keys: this.keys,
      target: this.target,
      source: this.source,
    };
  }
}
