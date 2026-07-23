import {
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  input,
  signal,
} from '@angular/core';
import MousePosition, { Options } from 'ol/control/MousePosition.js';
import { MapComponent } from '../map.component';
import { CoordinateFormat } from 'ol/coordinate.js';
import { ProjectionLike } from 'ol/proj.js';
import MapEvent from 'ol/MapEvent.js';

@Component({
  selector: 'aol-control-mouseposition',
  template: ``,
})
export class ControlMousePositionComponent implements OnInit, OnChanges, OnDestroy {
  readonly className = input<string>();
  readonly coordinateFormat = input<CoordinateFormat>();
  readonly projection = input<ProjectionLike>();
  readonly render = input<(event: MapEvent) => void>();
  readonly placeholder = input<string>();
  readonly wrapX = input<boolean>();

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
    private readonly map: MapComponent,
    private readonly element: ElementRef,
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

  ngOnChanges(changes: SimpleChanges) {
    if (!this.instance) {
      return;
    }
    if (changes.coordinateFormat?.currentValue !== undefined) {
      this.instance.setCoordinateFormat(changes.coordinateFormat.currentValue);
    }
    if (changes.projection?.currentValue !== undefined) {
      this.instance.setProjection(changes.projection.currentValue);
    }
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
