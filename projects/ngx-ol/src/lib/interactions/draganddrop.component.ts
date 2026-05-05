import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import { Options } from 'ol/interaction/DragAndDrop';
import FeatureFormat from 'ol/format/Feature';
import { MapComponent } from '../map.component';
import { ProjectionLike } from 'ol/proj';

@Component({
  selector: 'aol-interaction-draganddrop',
  template: '',
})
export class DragAndDropInteractionComponent implements OnInit, OnDestroy {
  @Input() formatConstructors?: FeatureFormat[];
  @Input() projection?: ProjectionLike;
  @Input() target?: HTMLElement;

  instance: DragAndDrop;

  protected readonly _instanceSignal = signal<DragAndDrop | undefined>(
    undefined,
  );

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: DragAndDrop): DragAndDrop {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.setInstance(new DragAndDrop(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      formatConstructors: this.formatConstructors,
      projection: this.projection,
      target: this.target,
    };
  }
}
