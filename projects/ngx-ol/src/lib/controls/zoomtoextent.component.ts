import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import ZoomToExtent from 'ol/control/ZoomToExtent';
import { Options } from 'ol/control/ZoomToExtent';
import { MapComponent } from '../map.component';
import { Extent } from 'ol/extent';

@Component({
  selector: 'aol-control-zoomtoextent',
  template: ` <ng-content></ng-content> `,
})
export class ControlZoomToExtentComponent implements OnInit, OnDestroy {
  @Input() className?: string;
  @Input() target?: string | HTMLElement;
  @Input() label?: string | HTMLElement;
  @Input() tipLabel?: string;
  @Input() extent?: Extent;

  instance: ZoomToExtent;

  protected readonly _instanceSignal = signal<ZoomToExtent | undefined>(
    undefined,
  );

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
    this.setInstance(new ZoomToExtent(this.createOptions()));
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
    // console.log('removing aol-control-zoomtoextent');
    this.map.instance.removeControl(this.instance);
  }

  private createOptions(): Options {
    return {
      className: this.className,
      target: this.target,
      label: this.label,
      tipLabel: this.tipLabel,
      extent: this.extent,
    };
  }
}
