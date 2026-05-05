import { Component, ElementRef, OnDestroy, OnInit, signal, input } from '@angular/core';
import MousePosition, { Options } from 'ol/control/MousePosition';
import { MapComponent } from '../map.component';
import { CoordinateFormat } from 'ol/coordinate';
import { ProjectionLike } from 'ol/proj';
import MapEvent from 'ol/MapEvent';

@Component({
  selector: 'aol-control-mouseposition',
  template: ``,
})
export class ControlMousePositionComponent implements OnInit, OnDestroy {
  className = input<string>();
  coordinateFormat = input<CoordinateFormat>();
  projection = input<ProjectionLike>();
  render = input<(event: MapEvent) => void>();
  placeholder = input<string>();
  wrapX = input<boolean>();

  instance: MousePosition;

  protected readonly _instanceSignal = signal<MousePosition | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: MousePosition): MousePosition {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  target: HTMLElement;

  constructor(
    private map: MapComponent,
    private element: ElementRef,
  ) {}

  ngOnInit() {
    this.target = this.element.nativeElement;
    // console.log('ol.control.MousePosition init: ', this);
    this.setInstance(new MousePosition(this.createOptions()));
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
    // console.log('removing aol-control-mouseposition');
    this.map.instance.removeControl(this.instance);
  }

  private createOptions(): Options {
    return {
      className: this.className(),
      coordinateFormat: this.coordinateFormat(),
      projection: this.projection(),
      render: this.render(),
      target: this.target,
      placeholder: this.placeholder(),
      wrapX: this.wrapX(),
    };
  }
}
