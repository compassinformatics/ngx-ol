import {
  signal,
  AfterContentInit,
  Component,
  Host,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  input,
} from '@angular/core';
import type { Size } from 'ol/size';
import Fill from 'ol/style/Fill';
import RegularShape from 'ol/style/RegularShape';
import type { Options } from 'ol/style/RegularShape';
import Stroke from 'ol/style/Stroke';
import type { DeclutterMode } from 'ol/style/Style';
import { StyleComponent } from './style.component';

@Component({
  selector: 'aol-style-regularshape',
  template: ` <ng-content></ng-content> `,
})
export class StyleRegularShapeComponent implements AfterContentInit, OnChanges, OnDestroy {
  fill = input<Fill>();

  points = input.required<number>();

  radius = input.required<number>();

  radius2 = input<number>();

  angle = input<number>();

  displacement = input<number[]>();

  stroke = input<Stroke>();

  rotation = input<number>();

  rotateWithView = input<boolean>();

  scale = input<number | Size>();

  declutterMode = input<DeclutterMode>();

  public componentType = 'style-regularshape';
  instance: RegularShape;

  protected readonly _instanceSignal = signal<RegularShape | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: RegularShape): RegularShape {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(@Host() private host: StyleComponent) {}

  update() {
    if (this.instance) {
      this.setInstance(new RegularShape(this.createOptions()));
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
