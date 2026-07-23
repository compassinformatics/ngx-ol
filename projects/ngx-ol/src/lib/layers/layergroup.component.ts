import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import Group from 'ol/layer/Group.js';
import { Options } from 'ol/layer/Group.js';
import { LayerComponent } from './layer.component';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-layer-group',
  template: ` <ng-content></ng-content> `,
})
export class LayerGroupComponent extends LayerComponent implements OnInit, OnDestroy {
  public instance: Group;

  protected readonly _instanceSignal = signal<Group | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Group): Group {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }
  constructor() {
    super(inject(LayerGroupComponent, { optional: true, skipSelf: true }) || inject(MapComponent));
  }

  ngOnInit() {
    // console.log(`creating ol.layer.Group instance with:`, this);
    this.setInstance(new Group(this.createOptions()));
    super.ngOnInit();
  }

  private createOptions(): Options {
    return {
      ...this.createLayerOptions(),
    };
  }
}
