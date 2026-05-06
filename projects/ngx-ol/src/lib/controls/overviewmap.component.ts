import {
  Component,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
  input,
} from '@angular/core';
import Collection from 'ol/Collection';
import MapEvent from 'ol/MapEvent';
import BaseLayer from 'ol/layer/Base';
import View from 'ol/View';
import OverviewMap from 'ol/control/OverviewMap';
import { Options } from 'ol/control/OverviewMap';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-control-overviewmap',
  template: ` <ng-content></ng-content> `,
})
export class ControlOverviewMapComponent implements OnInit, OnChanges, OnDestroy {
  className = input<string>();
  collapsed = input<boolean>();
  collapseLabel = input<string | HTMLElement>();
  collapsible = input<boolean>();
  label = input<string | HTMLElement>();
  layers = input<BaseLayer[] | Collection<BaseLayer>>();
  render = input<(event: MapEvent) => void>();
  rotateWithView = input<boolean>();
  target = input<string | HTMLElement>();
  tipLabel = input<string>();
  view = input<View>();
  instance: OverviewMap;
  protected readonly _instanceSignal = signal<OverviewMap | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: OverviewMap): OverviewMap {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.setInstance(new OverviewMap(this.createOptions()));
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeControl(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    const requiresReload = Object.keys(changes).some((key) => !changes[key].firstChange);

    if (requiresReload && this.instance) {
      this.reloadInstance();
    }
  }

  private reloadInstance() {
    this.map.instance.removeControl(this.instance);
    this.setInstance(new OverviewMap(this.createOptions()));
    this.map.instance.addControl(this.instance);
  }

  private createOptions(): Options {
    return {
      className: this.className(),
      collapsed: this.collapsed(),
      collapseLabel: this.collapseLabel(),
      collapsible: this.collapsible(),
      label: this.label(),
      layers: this.layers(),
      render: this.render(),
      rotateWithView: this.rotateWithView(),
      target: this.target(),
      tipLabel: this.tipLabel(),
      view: this.view(),
    };
  }
}
