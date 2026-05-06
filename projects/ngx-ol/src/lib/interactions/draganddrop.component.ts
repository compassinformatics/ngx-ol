import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, signal, input } from '@angular/core';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import { Options } from 'ol/interaction/DragAndDrop';
import FeatureFormat from 'ol/format/Feature';
import { MapComponent } from '../map.component';
import { ProjectionLike } from 'ol/proj';

@Component({
  selector: 'aol-interaction-draganddrop',
  template: '',
})
export class DragAndDropInteractionComponent implements OnInit, OnChanges, OnDestroy {
  formatConstructors = input<FeatureFormat[]>();
  projection = input<ProjectionLike>();
  target = input<HTMLElement>();
  instance: DragAndDrop;
  protected readonly _instanceSignal = signal<DragAndDrop | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: DragAndDrop): DragAndDrop {
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
    this.setInstance(new DragAndDrop(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  private reloadInstance() {
    this.map.instance.removeInteraction(this.instance);
    this.initializeInstance();
  }

  private createOptions(): Options {
    return {
      formatConstructors: this.formatConstructors(),
      projection: this.projection(),
      target: this.target(),
    };
  }
}
