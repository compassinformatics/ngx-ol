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
    this.host.instance.addFeature(this.instance);
  }

  ngOnDestroy() {
    this.host.instance.removeFeature(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    const { feature } = changes;
    if (this.instance) {
      this.instance.setId(this.id);
    }

    if (feature && !feature.firstChange) {
      this.host.instance.removeFeature(this.instance);
      this.instance = feature.currentValue;
      this.host.instance.addFeature(this.instance);
    }
  }
}
