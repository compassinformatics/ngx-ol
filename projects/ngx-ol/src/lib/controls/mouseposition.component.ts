import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
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
  @Input()
  className: string;
  @Input()
  coordinateFormat: CoordinateFormat;
  @Input()
  projection: ProjectionLike;
  @Input()
  render?: (event: MapEvent) => void;
  @Input()
  placeholder: string;
  @Input()
  wrapX: boolean;

  instance: MousePosition;
  target: HTMLElement;

  constructor(
    private map: MapComponent,
    private element: ElementRef,
  ) {}

  ngOnInit() {
    this.target = this.element.nativeElement;
    // console.log('ol.control.MousePosition init: ', this);
    this.instance = new MousePosition(this.createOptions());
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
    // console.log('removing aol-control-mouseposition');
    this.map.instance.removeControl(this.instance);
  }

  private createOptions(): Options {
    return {
      className: this.className,
      coordinateFormat: this.coordinateFormat,
      projection: this.projection,
      render: this.render,
      target: this.target,
      placeholder: this.placeholder,
      wrapX: this.wrapX,
    };
  }
}
