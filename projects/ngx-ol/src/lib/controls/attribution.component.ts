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
import Attribution from 'ol/control/Attribution.js';
import { Options } from 'ol/control/Attribution.js';
import MapEvent from 'ol/MapEvent.js';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-control-attribution',
  template: ``,
})
export class ControlAttributionComponent implements OnInit, OnChanges, OnDestroy {
  readonly className = input<string>();
  readonly collapsible = input<boolean>();
  readonly collapsed = input<boolean>();
  readonly tipLabel = input<string>();
  readonly label = input<string | HTMLElement>();
  readonly expandClassName = input<string>();
  readonly collapseLabel = input<string | HTMLElement>();
  readonly collapseClassName = input<string>();
  readonly render = input<(event: MapEvent) => void>();

  readonly componentType: string = 'control';
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
    private readonly map: MapComponent,
    private readonly element: ElementRef,
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

  ngOnChanges(changes: SimpleChanges) {
    if (!this.instance) {
      return;
    }
    if (changes.collapsible?.currentValue !== undefined) {
      this.instance.setCollapsible(changes.collapsible.currentValue);
    }
    if (changes.collapsed?.currentValue !== undefined) {
      this.instance.setCollapsed(changes.collapsed.currentValue);
    }
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
