import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Feature, MapBrowserEvent } from 'ol';
import { SourceVectorComponent } from './sources/vector.component';

@Component({
  selector: 'aol-feature',
  template: ` <ng-content></ng-content> `,
})
export class FeatureComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  id: string | number | undefined;

  @Input()
  properties: Record<any, any>;

  @Input()
  feature: Feature;

  @Input()
  clickable: boolean;

  @Output()
  olClick = new EventEmitter<{ event: MapBrowserEvent<MouseEvent>; feature: Feature }>();
  @Output()
  singleClick = new EventEmitter<{ event: MapBrowserEvent<MouseEvent>; feature: Feature }>();
  @Output()
  dblClick = new EventEmitter<{ event: MapBrowserEvent<MouseEvent>; feature: Feature }>();

  public componentType = 'feature';
  public instance: Feature;

  constructor(private host: SourceVectorComponent) {}

  ngOnInit() {
    this.instance = this.feature || new Feature();
    if (this.properties) {
      this.instance.setProperties(this.properties);
    }
    if (this.id !== undefined) {
      this.instance.setId(this.id);
    }
    if (this.clickable) {
      this.instance.set('__aol-feature', this);
    }
    this.host.instance.addFeature(this.instance);
  }

  ngOnDestroy() {
    this.instance.set('__aol-feature', null);
    this.host.instance.removeFeature(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    const { feature, clickable } = changes;
    if (this.instance) {
      this.instance.setId(this.id);
    }

    if (feature && !feature.firstChange) {
      this.instance.set('__aol-feature', null);
      this.host.instance.removeFeature(this.instance);
      this.instance = feature.currentValue;
      if (this.clickable) {
        this.instance.set('__aol-feature', this);
      }
      this.host.instance.addFeature(this.instance);
    }

    if (clickable && !clickable.firstChange) {
      this.instance.set('__aol-feature', clickable.currentValue ? this : null);
    }
  }
}
