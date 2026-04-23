import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Attribution } from 'ol/control';
import MapEvent from 'ol/MapEvent';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-control-attribution',
  template: ``,
})
export class ControlAttributionComponent implements OnInit, OnDestroy {
  @Input()
  className: string;
  @Input()
  collapsible: boolean;
  @Input()
  collapsed: boolean;
  @Input()
  tipLabel: string;
  @Input()
  label: string | HTMLElement;
  @Input()
  expandClassName: string;
  @Input()
  collapseLabel: string | HTMLElement;
  @Input()
  collapseClassName: string;
  @Input()
  render?: (event: MapEvent) => void;

  public componentType = 'control';
  instance: Attribution;
  target: HTMLElement;

  constructor(
    private map: MapComponent,
    private element: ElementRef,
  ) {}

  ngOnInit() {
    this.target = this.element.nativeElement;
    // console.log('ol.control.Attribution init: ', this);
    this.instance = new Attribution(this);
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
    // console.log('removing aol-control-attribution');
    this.map.instance.removeControl(this.instance);
  }
}
