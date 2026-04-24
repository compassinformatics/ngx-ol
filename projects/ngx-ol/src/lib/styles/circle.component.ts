import {
  Component,
  Input,
  Host,
  AfterContentInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Circle, Fill, Stroke } from 'ol/style';
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
  @Input()
  fill?: Fill;
  @Input()
  radius: number;
  @Input()
  stroke?: Stroke;
  @Input()
  displacement?: number[];
  @Input()
  scale?: number | Size;
  @Input()
  rotation?: number;
  @Input()
  rotateWithView?: boolean;
  @Input()
  declutterMode?: DeclutterMode;

  public componentType = 'style-circle';
  public instance: Circle;

  constructor(@Host() private host: StyleComponent) {}

  /**
   * WORK-AROUND: since the re-rendering is not triggered on style change
   * we trigger a radius change.
   * see openlayers #6233 and #5775
   */
  update() {
    if (!!this.instance) {
      // console.log('setting ol.style.Circle instance\'s radius');
      this.instance.setRadius(this.radius);
    }
    this.host.update();
  }

  ngAfterContentInit() {
    // console.log('creating ol.style.Circle instance with: ', this);
    this.instance = new Circle(this.createOptions());
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
      fill: this.fill,
      radius: this.radius,
      stroke: this.stroke,
      displacement: this.displacement,
      scale: this.scale,
      rotation: this.rotation,
      rotateWithView: this.rotateWithView,
      declutterMode: this.declutterMode,
    };
  }
}
