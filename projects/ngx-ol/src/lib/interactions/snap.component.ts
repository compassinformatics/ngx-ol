import { Component, OnDestroy, OnInit, input, output, signal } from '@angular/core';
import BaseEvent from 'ol/events/Event';
import { SnapEvent } from 'ol/events/SnapEvent';
import Snap from 'ol/interaction/Snap';
import { Options } from 'ol/interaction/Snap';
import { ObjectEvent } from 'ol/Object';
import { MapComponent } from '../map.component';
import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import Vector from 'ol/source/Vector';

@Component({
  selector: 'aol-interaction-snap',
  template: '',
})
export class SnapInteractionComponent implements OnInit, OnDestroy {
  features = input<Collection<Feature>>();
  edge = input<boolean>();
  vertex = input<boolean>();
  pixelTolerance = input<number>();
  source = input<Vector>();

  olChange = output<BaseEvent>();
  changeActive = output<ObjectEvent>();
  olError = output<BaseEvent>();
  propertyChange = output<ObjectEvent>();
  snap = output<SnapEvent>();

  instance: Snap;

  protected readonly _instanceSignal = signal<Snap | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Snap): Snap {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  constructor(private map: MapComponent) {}

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
