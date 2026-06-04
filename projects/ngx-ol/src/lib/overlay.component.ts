import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  contentChild,
  input,
  signal,
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
  protected readonly content = contentChild(ContentComponent);

  id = input<number | string | undefined>();
  offset = input<number[]>();
  positioning = input<Positioning>();
  stopEvent = input<boolean>();
  insertFirst = input<boolean>();
  autoPan = input<boolean | PanIntoViewOptions>();
  position = input<Coordinate | undefined>();
  className = input<string>();

  componentType = 'overlay';
  instance: Overlay;
  protected readonly _instanceSignal = signal<Overlay | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Overlay): Overlay {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }
  element: HTMLElement;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    const content = this.content();

    if (content) {
      this.element = content.elementRef.nativeElement;
      this.setInstance(new Overlay(this.createOptions()));
      this.map.instance.addOverlay(this.instance);
    }
  }

  ngOnDestroy() {
    if (this.instance) {
      this.map.instance.removeOverlay(this.instance);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { offset, position, positioning } = changes;

    if (position && this.instance) {
      this.instance.setPosition(position.currentValue);
    }
    if (offset && this.instance) {
      this.instance.setOffset(offset.currentValue);
    }
    if (positioning && this.instance) {
      this.instance.setPositioning(positioning.currentValue);
    }
  }

  private createOptions(): Options {
    return {
      autoPan: this.autoPan(),
      className: this.className(),
      element: this.element,
      id: this.id(),
      insertFirst: this.insertFirst(),
      offset: this.offset(),
      position: this.position(),
      positioning: this.positioning(),
      stopEvent: this.stopEvent(),
    };
  }
}
