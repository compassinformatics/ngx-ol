import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
  @Input()
  className?: string;
  @Input()
  collapsed?: boolean;
  @Input()
  collapseLabel?: string | HTMLElement;
  @Input()
  collapsible?: boolean;
  @Input()
  label?: string | HTMLElement;
  @Input()
  layers?: BaseLayer[] | Collection<BaseLayer>;
  @Input()
  render?: (event: MapEvent) => void;
  @Input()
  rotateWithView?: boolean;
  @Input()
  target?: string | HTMLElement;
  @Input()
  tipLabel?: string;
  @Input()
  view?: View;

  instance: OverviewMap;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new OverviewMap(this.createOptions());
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeControl(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.instance != null && changes.hasOwnProperty('view')) {
      this.reloadInstance();
    }
  }

  private reloadInstance() {
    this.map.instance.removeControl(this.instance);
    this.instance = new OverviewMap(this.createOptions());
    this.map.instance.addControl(this.instance);
  }

  private createOptions(): Options {
    return {
      className: this.className,
      collapsed: this.collapsed,
      collapseLabel: this.collapseLabel,
      collapsible: this.collapsible,
      label: this.label,
      layers: this.layers,
      render: this.render,
      rotateWithView: this.rotateWithView,
      target: this.target,
      tipLabel: this.tipLabel,
      view: this.view,
    };
  }
}
