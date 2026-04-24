import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DragAndDrop } from 'ol/interaction';
import { Options } from 'ol/interaction/DragAndDrop';
import FeatureFormat from 'ol/format/Feature';
import { MapComponent } from '../map.component';
import { ProjectionLike } from 'ol/proj';

@Component({
  selector: 'aol-interaction-draganddrop',
  template: '',
})
export class DragAndDropInteractionComponent implements OnInit, OnDestroy {
  @Input()
  formatConstructors?: FeatureFormat[];
  @Input()
  projection?: ProjectionLike;
  @Input()
  target?: HTMLElement;

  instance: DragAndDrop;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new DragAndDrop(this.createOptions());
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
