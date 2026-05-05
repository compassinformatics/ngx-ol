import { Component, ElementRef, OnDestroy, OnInit, signal, input } from '@angular/core';
import Attribution from 'ol/control/Attribution';
import { Options } from 'ol/control/Attribution';
import MapEvent from 'ol/MapEvent';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-control-attribution',
  template: ``,
})
export class ControlAttributionComponent implements OnInit, OnDestroy {
  className = input<string>();
  collapsible = input<boolean>();
  collapsed = input<boolean>();
  tipLabel = input<string>();
  label = input<string | HTMLElement>();
  expandClassName = input<string>();
  collapseLabel = input<string | HTMLElement>();
  collapseClassName = input<string>();
  render = input<(event: MapEvent) => void>();

  public componentType = 'control';
  instance: Attribution;

  protected readonly _instanceSignal = signal<Attribution | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Attribution): Attribution {
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
    // console.log('ol.control.Attribution init: ', this);
    this.setInstance(new Attribution(this.createOptions()));
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
    // console.log('removing aol-control-attribution');
    this.map.instance.removeControl(this.instance);
  }

  private createOptions(): Options {
    return {
      className: this.className(),
      collapsible: this.collapsible(),
      collapsed: this.collapsed(),
      tipLabel: this.tipLabel(),
      label: this.label(),
      expandClassName: this.expandClassName(),
      collapseLabel: this.collapseLabel(),
      collapseClassName: this.collapseClassName(),
      render: this.render(),
      target: this.target,
    };
  }
}
