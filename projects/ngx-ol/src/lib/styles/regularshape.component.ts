import {
  AfterContentInit,
  Component,
  Host,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
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
  @Input() fill?: Fill;

  @Input() points: number;

  @Input() radius: number;

  @Input() radius2?: number;

  @Input() angle?: number;

  @Input() displacement?: number[];

  @Input() stroke?: Stroke;

  @Input() rotation?: number;

  @Input() rotateWithView?: boolean;

  @Input() scale?: number | Size;

  @Input() declutterMode?: DeclutterMode;

  public componentType = 'style-regularshape';
  public instance: RegularShape;

  constructor(@Host() private host: StyleComponent) {}

  update() {
    if (this.instance) {
      this.instance = new RegularShape(this.createOptions());
      this.host.instance.setImage(this.instance);
    }
    this.host.update();
  }

  ngAfterContentInit() {
    this.instance = new RegularShape(this.createOptions());
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

    this.instance = new RegularShape(this.createOptions());
    this.host.instance.setImage(this.instance);
    this.host.update();
  }

  ngOnDestroy() {}

  private createOptions(): Options {
    return {
      fill: this.fill,
      points: this.points,
      radius: this.radius,
      radius2: this.radius2,
      angle: this.angle,
      displacement: this.displacement,
      stroke: this.stroke,
      rotation: this.rotation,
      rotateWithView: this.rotateWithView,
      scale: this.scale,
      declutterMode: this.declutterMode,
    };
  }
}
