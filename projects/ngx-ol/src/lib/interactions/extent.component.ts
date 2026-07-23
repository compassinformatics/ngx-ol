import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  input,
  output,
  signal,
  inject,
} from '@angular/core';
import type { Condition } from 'ol/events/condition.js';
import type { Extent as ExtentType } from 'ol/extent.js';
import ExtentInteraction, { ExtentEvent } from 'ol/interaction/Extent.js';
import type { Options } from 'ol/interaction/Extent.js';
import type { StyleLike } from 'ol/style/Style.js';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-extent',
  template: '',
})
export class ExtentInteractionComponent implements OnInit, OnChanges, OnDestroy {
  readonly condition = input<Condition>();

  readonly extent = input<ExtentType>();

  readonly boxStyle = input<StyleLike>();

  readonly pixelTolerance = input<number>();

  readonly pointerStyle = input<StyleLike>();

  readonly wrapX = input<boolean>();

  readonly extentChanged = output<ExtentEvent>();

  instance: ExtentInteraction;

  protected readonly _instanceSignal = signal<ExtentInteraction | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: ExtentInteraction): ExtentInteraction {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  private readonly map = inject(MapComponent);

  ngOnInit() {
    this.setInstance(new ExtentInteraction(this.createOptions()));
    this.instance.on('extentchanged', (event) => this.extentChanged.emit(event));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.instance && changes.extent) {
      this.instance.setExtent(changes.extent.currentValue);
    }
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
