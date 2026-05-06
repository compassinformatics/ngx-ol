import {
  Component,
  EventEmitter,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  signal,
  input,
} from '@angular/core';
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
export class SnapInteractionComponent implements OnInit, OnChanges, OnDestroy {
  features = input<Collection<Feature>>();
  edge = input<boolean>();
  vertex = input<boolean>();
  pixelTolerance = input<number>();
  source = input<Vector>();

  @Output() olChange = new EventEmitter<BaseEvent>();
  @Output() olChangeActive = new EventEmitter<ObjectEvent>();
  @Output() olError = new EventEmitter<BaseEvent>();
  @Output() propertyChange = new EventEmitter<ObjectEvent>();
  @Output() olSnap = new EventEmitter<SnapEvent>();

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
    this.initializeInstance();
  }

  ngOnChanges(changes: SimpleChanges) {
    const requiresReload = Object.keys(changes).some((key) => !changes[key].firstChange);

    if (requiresReload && this.instance) {
      this.reloadInstance();
    }
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private initializeInstance() {
    this.setInstance(new Snap(this.createOptions()));
    this.bindInstanceEvents();
    this.map.instance.addInteraction(this.instance);
  }

  private reloadInstance() {
    this.map.instance.removeInteraction(this.instance);
    this.initializeInstance();
  }

  private bindInstanceEvents() {
    this.instance.on('change', (event: BaseEvent) => this.olChange.emit(event));
    this.instance.on('change:active', (event: ObjectEvent) => this.olChangeActive.emit(event));
    this.instance.on('error', (event: BaseEvent) => this.olError.emit(event));
    this.instance.on('propertychange', (event: ObjectEvent) => this.propertyChange.emit(event));
    this.instance.on('snap', (event: SnapEvent) => this.olSnap.emit(event));
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
