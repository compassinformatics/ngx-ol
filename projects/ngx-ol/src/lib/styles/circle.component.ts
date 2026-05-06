import {
  signal,
  Component,
  Host,
  AfterContentInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  input,
} from '@angular/core';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import { Options } from 'ol/style/Circle';
import { StyleComponent } from './style.component';
import ImageStyle from 'ol/style/Image';
import { Size } from 'ol/size';
import { DeclutterMode } from 'ol/style/Style';

@Component({
  selector: 'aol-style-circle',
  template: ` <ng-content></ng-content> `,
})
export class StyleCircleComponent implements AfterContentInit, OnChanges, OnDestroy {
  readonly fill = input<Fill>();
  readonly radius = input.required<number>();
  readonly stroke = input<Stroke>();
  readonly displacement = input<number[]>();
  readonly scale = input<number | Size>();
  readonly rotation = input<number>();
  readonly rotateWithView = input<boolean>();
  readonly declutterMode = input<DeclutterMode>();
  readonly componentType: string = 'style-circle';
  instance: Circle;
  private childFill?: Fill;
  private childStroke?: Stroke;
  protected readonly _instanceSignal = signal<Circle | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Circle): Circle {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(@Host() private readonly host: StyleComponent) {}

  /**
   * WORK-AROUND: since the re-rendering is not triggered on style change
   * we trigger a radius change.
   * see openlayers #6233 and #5775
   */
  update() {
    if (!!this.instance) {
      // console.log('setting ol.style.Circle instance\'s radius');
      this.instance.setRadius(this.radius());
    }
    this.host.update();
  }

  setFill(fill: Fill) {
    this.childFill = fill;
    if (this.instance) {
      this.instance.setFill(fill);
    }
    this.host.update();
  }

  setStroke(stroke: Stroke) {
    this.childStroke = stroke;
    if (this.instance) {
      this.instance.setStroke(stroke);
    }
    this.host.update();
  }

  ngAfterContentInit() {
    // console.log('creating ol.style.Circle instance with: ', this);
    this.setInstance(new Circle(this.createOptions()));
    this.host.instance.setImage(this.instance);
    this.host.update();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.instance) {
      return;
    }
    if (changes.radius) {
      this.instance.setRadius(changes.radius.currentValue);
    }
    // console.log('changes detected in aol-style-circle, setting new radius: ', changes['radius'].currentValue);
  }

  ngOnDestroy() {
    // console.log('removing aol-style-circle');
    // this.host.instance.setImage(null);
  }

  private createOptions(): Options {
    return {
      fill: this.childFill ?? this.fill(),
      radius: this.radius(),
      stroke: this.childStroke ?? this.stroke(),
      displacement: this.displacement(),
      scale: this.scale(),
      rotation: this.rotation(),
      rotateWithView: this.rotateWithView(),
      declutterMode: this.declutterMode(),
    };
  }
}
