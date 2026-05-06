import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  signal,
  output,
  input,
} from '@angular/core';
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

  constructor(private readonly map: MapComponent) {}

  ngOnInit() {
    this.initializeInstance();
  }

  ngOnChanges(changes: SimpleChanges) {
    const requiresReload = Object.keys(changes).some((key) => !changes[key].firstChange);

    if (requiresReload && this.instance) {
      this.reloadInstance();
    }
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private initializeInstance() {
    this.setInstance(new ExtentInteraction(this.createOptions()));
    this.instance.on('extentchanged', (event) => this.extentChanged.emit(event));
    this.map.instance.addInteraction(this.instance);
  }

  private reloadInstance() {
    this.map.instance.removeInteraction(this.instance);
    this.initializeInstance();
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
