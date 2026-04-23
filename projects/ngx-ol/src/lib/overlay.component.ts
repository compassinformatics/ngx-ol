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
import Overlay, { Options, PanIntoViewOptions, Positioning } from 'ol/Overlay';
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
  id: number | string | undefined;
  @Input()
  offset: number[];
  @Input()
  positioning: Positioning;
  @Input()
  stopEvent: boolean;
  @Input()
  insertFirst: boolean;
  @Input()
  autoPan: boolean | PanIntoViewOptions;
  @Input()
  position: Coordinate | undefined;
  @Input()
  className: string;

  componentType = 'overlay';
  instance: Overlay;
  element: HTMLElement;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    if (this.content) {
      this.element = this.content.elementRef.nativeElement;
      this.instance = new Overlay(this.createOptions());
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

  private createOptions(): Options {
    return {
      autoPan: this.autoPan,
      className: this.className,
      element: this.element,
      id: this.id,
      insertFirst: this.insertFirst,
      offset: this.offset,
      position: this.position,
      positioning: this.positioning,
      stopEvent: this.stopEvent,
    };
  }
}
