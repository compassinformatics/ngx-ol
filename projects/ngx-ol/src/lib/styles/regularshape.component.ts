import {
  AfterContentInit,
  Component,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
  input,
  signal,
} from '@angular/core';
import type { Size } from 'ol/size.js';
import Fill from 'ol/style/Fill.js';
import RegularShape from 'ol/style/RegularShape.js';
import type { Options } from 'ol/style/RegularShape.js';
import Stroke from 'ol/style/Stroke.js';
import type { DeclutterMode } from 'ol/style/Style.js';
import { StyleComponent } from './style.component';

@Component({
  selector: 'aol-style-regularshape',
  template: ` <ng-content></ng-content> `,
})
export class StyleRegularShapeComponent implements AfterContentInit, OnChanges, OnDestroy {
  readonly fill = input<Fill>();

  readonly points = input.required<number>();

  readonly radius = input.required<number>();

  readonly radius2 = input<number>();

  readonly angle = input<number>();

  readonly displacement = input<number[]>();

  readonly stroke = input<Stroke>();

  readonly rotation = input<number>();

  readonly rotateWithView = input<boolean>();

  readonly scale = input<number | Size>();

  readonly declutterMode = input<DeclutterMode>();

  readonly componentType: string = 'style-regularshape';
  public instance: RegularShape;

  protected readonly _instanceSignal = signal<RegularShape | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: RegularShape): RegularShape {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }
  private readonly host = inject(StyleComponent, { host: true });

  update() {
    if (this.instance) {
      this.instance.setFill(this.fill() ?? null);
      this.instance.setStroke(this.stroke() ?? null);
      this.host.instance.setImage(this.instance);
    }
    this.host.update();
  }

  ngAfterContentInit() {
    this.setInstance(new RegularShape(this.createOptions()));
    this.host.instance.setImage(this.instance);
    this.host.update();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      !this.instance ||
      (!changes.fill &&
        !changes.points &&
        !changes.radius &&
        !changes.radius2 &&
        !changes.angle &&
        !changes.displacement &&
        !changes.stroke &&
        !changes.rotation &&
        !changes.rotateWithView &&
        !changes.scale &&
        !changes.declutterMode)
    ) {
      return;
    }

    const requiresReload =
      changes.points ||
      changes.radius ||
      changes.radius2 ||
      changes.angle ||
      changes.displacement ||
      changes.rotation ||
      changes.rotateWithView ||
      changes.scale ||
      changes.declutterMode;

    if (!requiresReload) {
      if (changes.fill) {
        this.instance.setFill(changes.fill.currentValue ?? null);
      }
      if (changes.stroke) {
        this.instance.setStroke(changes.stroke.currentValue ?? null);
      }
      this.host.instance.setImage(this.instance);
      this.host.update();
      return;
    }

    this.setInstance(new RegularShape(this.createOptions()));
    this.host.instance.setImage(this.instance);
    this.host.update();
  }

  ngOnDestroy() {}

  private createOptions(): Options {
    return {
      fill: this.fill(),
      points: this.points(),
      radius: this.radius(),
      radius2: this.radius2(),
      angle: this.angle(),
      displacement: this.displacement(),
      stroke: this.stroke(),
      rotation: this.rotation(),
      rotateWithView: this.rotateWithView(),
      scale: this.scale(),
      declutterMode: this.declutterMode(),
    };
  }
}
