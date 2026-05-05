import { Component, OnDestroy, OnInit, SkipSelf, Optional, signal } from '@angular/core';
import Group from 'ol/layer/Group';
import { Options } from 'ol/layer/Group';
import { LayerComponent } from './layer.component';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-layer-group',
  template: ` <ng-content></ng-content> `,
})
export class LayerGroupComponent extends LayerComponent implements OnInit, OnDestroy {
  instance: Group;

  protected readonly _instanceSignal = signal<Group | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Group): Group {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(
    map: MapComponent,
    @SkipSelf()
    @Optional()
    group?: LayerGroupComponent,
  ) {
    super(group || map);
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
