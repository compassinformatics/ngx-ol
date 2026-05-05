import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import type { Condition } from 'ol/events/condition';
import type { Extent as ExtentType } from 'ol/extent';
import ExtentInteraction, { ExtentEvent } from 'ol/interaction/Extent';
import type { Options } from 'ol/interaction/Extent';
import type { StyleLike } from 'ol/style/Style';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-extent',
  template: '',
})
export class ExtentInteractionComponent implements OnInit, OnDestroy {
  @Input()
  condition?: Condition;

  @Input()
  extent?: ExtentType;

  @Input()
  boxStyle?: StyleLike;

  @Input()
  pixelTolerance?: number;

  @Input()
  pointerStyle?: StyleLike;

  @Input()
  wrapX?: boolean;

  @Output()
  extentChanged = new EventEmitter<ExtentEvent>();

  instance: ExtentInteraction;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new ExtentInteraction(this.createOptions());
    this.instance.on('extentchanged', (event) => this.extentChanged.emit(event));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      condition: this.condition,
      extent: this.extent,
      boxStyle: this.boxStyle,
      pixelTolerance: this.pixelTolerance,
      pointerStyle: this.pointerStyle,
      wrapX: this.wrapX,
    };
  }
}
