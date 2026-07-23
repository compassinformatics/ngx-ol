import {
  Component,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
  input,
  signal,
  inject,
} from '@angular/core';
import Collection from 'ol/Collection.js';
import MapEvent from 'ol/MapEvent.js';
import BaseLayer from 'ol/layer/Base.js';
import View from 'ol/View.js';
import OverviewMap from 'ol/control/OverviewMap.js';
import { Options } from 'ol/control/OverviewMap.js';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-control-overviewmap',
  template: ` <ng-content></ng-content> `,
})
export class ControlOverviewMapComponent implements OnInit, OnChanges, OnDestroy {
  readonly className = input<string>();
  readonly collapsed = input<boolean>();
  readonly collapseLabel = input<string | HTMLElement>();
  readonly collapsible = input<boolean>();
  readonly label = input<string | HTMLElement>();
  readonly layers = input<BaseLayer[] | Collection<BaseLayer>>();
  readonly render = input<(event: MapEvent) => void>();
  readonly rotateWithView = input<boolean>();
  readonly target = input<string | HTMLElement>();
  readonly tipLabel = input<string>();
  readonly view = input<View>();

  instance: OverviewMap;

  protected readonly _instanceSignal = signal<OverviewMap | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: OverviewMap): OverviewMap {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  private readonly map = inject(MapComponent);

  ngOnInit() {
    this.setInstance(new OverviewMap(this.createOptions()));
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
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
    if (changes.rotateWithView?.currentValue !== undefined) {
      this.instance.setRotateWithView(changes.rotateWithView.currentValue);
    }
    if (this.instance != null && changes.hasOwnProperty('view')) {
      this.replaceInstance();
    }
  }

  private replaceInstance() {
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
