import {
  signal,
  Component,
  ContentChild,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  input,
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
  @ContentChild(ContentComponent, { static: true }) content: ContentComponent;

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
    if (this.content) {
      this.element = this.content.elementRef.nativeElement;
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
    const { position } = changes;

    if (position && this.instance) {
      this.instance.setPosition(position.currentValue);
    }

    const requiresReload = Object.keys(changes).some(
      (key) => key !== 'position' && !changes[key].firstChange,
    );

    if (requiresReload && this.instance) {
      this.reloadInstance();
    }
  }

  private reloadInstance() {
    this.map.instance.removeOverlay(this.instance);
    this.setInstance(new Overlay(this.createOptions()));
    this.map.instance.addOverlay(this.instance);
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
