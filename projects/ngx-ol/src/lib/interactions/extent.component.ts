import { Component, EventEmitter, OnDestroy, OnInit, Output, signal, input } from '@angular/core';
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
  condition = input<Condition>();

  extent = input<ExtentType>();

  boxStyle = input<StyleLike>();

  pixelTolerance = input<number>();

  pointerStyle = input<StyleLike>();

  wrapX = input<boolean>();

  @Output() extentChanged = new EventEmitter<ExtentEvent>();

  instance: ExtentInteraction;

  protected readonly _instanceSignal = signal<ExtentInteraction | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: ExtentInteraction): ExtentInteraction {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.setInstance(new ExtentInteraction(this.createOptions()));
    this.instance.on('extentchanged', (event) => this.extentChanged.emit(event));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      condition: this.condition(),
      extent: this.extent(),
      boxStyle: this.boxStyle(),
      pixelTolerance: this.pixelTolerance(),
      pointerStyle: this.pointerStyle(),
      wrapX: this.wrapX(),
    };
  }
}
