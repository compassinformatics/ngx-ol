import {
  Component,
  ContentChild,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MapComponent } from './map.component';
import Overlay, { PanOptions, Positioning } from 'ol/Overlay';
import { ContentComponent } from './content.component';
import { Coordinate } from 'ol/coordinate';

@Component({
  selector: 'aol-overlay',
  template: '<ng-content></ng-content>',
})
export class OverlayComponent implements OnInit, OnDestroy, OnChanges {
  @ContentChild(ContentComponent, { static: true })
  content: ContentComponent;

  @Input()
  id: number | string;
  @Input()
  offset: number[];
  @Input()
  positioning: Positioning;
  @Input()
  stopEvent: boolean;
  @Input()
  insertFirst: boolean;
  @Input()
  autoPan: boolean;
  @Input()
  autoPanAnimation: PanOptions;
  @Input()
  autoPanMargin: number;
  @Input()
  position: Coordinate;

  componentType = 'overlay';
  instance: Overlay;
  element: HTMLElement;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    if (this.content) {
      this.element = this.content.elementRef.nativeElement;
      this.instance = new Overlay(this);
      this.map.instance.addOverlay(this.instance);
    }
  }

  ngOnDestroy() {
    if (this.instance) {
      this.map.instance.removeOverlay(this.instance);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { position } = changes;

    if (position && this.instance) {
      this.instance.setPosition(position.currentValue);
    }
  }
}
