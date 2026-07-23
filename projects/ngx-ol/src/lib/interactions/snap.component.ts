import { Component, OnDestroy, OnInit, input, output, signal, inject } from '@angular/core';
import BaseEvent from 'ol/events/Event.js';
import { SnapEvent } from 'ol/events/SnapEvent.js';
import Snap from 'ol/interaction/Snap.js';
import { Options } from 'ol/interaction/Snap.js';
import { ObjectEvent } from 'ol/Object.js';
import { MapComponent } from '../map.component';
import Collection from 'ol/Collection.js';
import Feature from 'ol/Feature.js';
import Vector from 'ol/source/Vector.js';

@Component({
  selector: 'aol-interaction-snap',
  template: '',
})
export class SnapInteractionComponent implements OnInit, OnDestroy {
  readonly features = input<Collection<Feature>>();
  readonly edge = input<boolean>();
  readonly vertex = input<boolean>();
  readonly pixelTolerance = input<number>();
  readonly source = input<Vector>();

  readonly olChange = output<BaseEvent>();
  readonly changeActive = output<ObjectEvent>();
  readonly olError = output<BaseEvent>();
  readonly propertyChange = output<ObjectEvent>();
  readonly snap = output<SnapEvent>();

  instance: Snap;

  protected readonly _instanceSignal = signal<Snap | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Snap): Snap {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  private readonly map = inject(MapComponent);

  ngOnInit() {
    this.setInstance(new Snap(this.createOptions()));

    this.instance.on('change', (event: BaseEvent) => this.olChange.emit(event));
    this.instance.on('change:active', (event: ObjectEvent) => this.changeActive.emit(event));
    this.instance.on('error', (event: BaseEvent) => this.olError.emit(event));
    this.instance.on('propertychange', (event: ObjectEvent) => this.propertyChange.emit(event));
    this.instance.on('snap', (event: SnapEvent) => this.snap.emit(event));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      features: this.features(),
      edge: this.edge(),
      vertex: this.vertex(),
      pixelTolerance: this.pixelTolerance(),
      source: this.source(),
    };
  }
}
