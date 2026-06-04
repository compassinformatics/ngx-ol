import {
  Component,
  Optional,
  OnInit,
  OnChanges,
  SimpleChanges,
  input,
  signal,
} from '@angular/core';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Text from 'ol/style/Text';
import { StyleComponent } from './style.component';
import { Options, TextJustify, TextPlacement } from 'ol/style/Text';
import { DeclutterMode } from 'ol/style/Style';
import { Size } from 'ol/size';

@Component({
  selector: 'aol-style-text',
  template: ` <div class="aol-style-text"></div> `,
})
export class StyleTextComponent implements OnInit, OnChanges {
  font = input<string | undefined>();
  maxAngle = input<number | undefined>();
  offsetX = input<number | undefined>();
  offsetY = input<number | undefined>();
  overflow = input<boolean | undefined>();
  placement = input<TextPlacement | undefined>();
  repeat = input<number | undefined>();
  scale = input<number | Size | undefined>();
  rotateWithView = input<boolean | undefined>();
  rotation = input<number | undefined>();
  text = input<string | string[] | undefined>();
  textAlign = input<CanvasTextAlign | undefined>();
  justify = input<TextJustify | undefined>();
  textBaseline = input<CanvasTextBaseline | undefined>();
  fill = input<Fill | undefined>();
  stroke = input<Stroke | undefined>();
  backgroundFill = input<Fill | undefined>();
  backgroundStroke = input<Stroke | undefined>();
  padding = input<number[] | undefined>();
  declutterMode = input<DeclutterMode | undefined>();

  public instance: Text;

  protected readonly _instanceSignal = signal<Text | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Text): Text {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  public componentType = 'style-text';

  constructor(@Optional() private host: StyleComponent) {
    if (!host) {
      throw new Error('aol-style-text must be a descendant of aol-style');
    }
    // console.log('creating aol-style-text with: ', this);
  }

  ngOnInit() {
    // console.log('creating ol.style.Text instance with: ', this);
    this.setInstance(new Text(this.createOptions()));
    this.host.instance.setText(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.instance) {
      return;
    }
    if (changes.font) {
      this.instance.setFont(changes.font.currentValue);
    }
    if (changes.maxAngle?.currentValue !== undefined) {
      this.instance.setMaxAngle(changes.maxAngle.currentValue);
    }
    if (changes.offsetX) {
      this.instance.setOffsetX(changes.offsetX.currentValue);
    }
    if (changes.offsetY) {
      this.instance.setOffsetY(changes.offsetY.currentValue);
    }
    if (changes.overflow?.currentValue !== undefined) {
      this.instance.setOverflow(changes.overflow.currentValue);
    }
    if (changes.placement?.currentValue !== undefined) {
      this.instance.setPlacement(changes.placement.currentValue);
    }
    if (changes.repeat) {
      this.instance.setRepeat(changes.repeat.currentValue);
    }
    if (changes.rotateWithView?.currentValue !== undefined) {
      this.instance.setRotateWithView(changes.rotateWithView.currentValue);
    }
    if (changes.scale) {
      this.instance.setScale(changes.scale.currentValue);
    }
    if (changes.rotation) {
      this.instance.setRotation(changes.rotation.currentValue);
    }
    if (changes.text) {
      this.instance.setText(changes.text.currentValue);
    }
    if (changes.textAlign) {
      this.instance.setTextAlign(changes.textAlign.currentValue);
    }
    if (changes.justify) {
      this.instance.setJustify(changes.justify.currentValue);
    }
    if (changes.textBaseline) {
      this.instance.setTextBaseline(changes.textBaseline.currentValue);
    }
    if (changes.fill) {
      this.instance.setFill(changes.fill.currentValue);
    }
    if (changes.stroke) {
      this.instance.setStroke(changes.stroke.currentValue);
    }
    if (changes.backgroundFill) {
      this.instance.setBackgroundFill(changes.backgroundFill.currentValue);
    }
    if (changes.backgroundStroke) {
      this.instance.setBackgroundStroke(changes.backgroundStroke.currentValue);
    }
    if (changes.padding) {
      this.instance.setPadding(changes.padding.currentValue);
    }
    this.host.update();
    // console.log('changes detected in aol-style-text, setting new properties: ', changes);
  }

  update() {}

  private createOptions(): Options {
    return {
      font: this.font(),
      maxAngle: this.maxAngle(),
      offsetX: this.offsetX(),
      offsetY: this.offsetY(),
      overflow: this.overflow(),
      placement: this.placement(),
      repeat: this.repeat(),
      scale: this.scale(),
      rotateWithView: this.rotateWithView(),
      rotation: this.rotation(),
      text: this.text(),
      textAlign: this.textAlign(),
      justify: this.justify(),
      textBaseline: this.textBaseline(),
      fill: this.fill(),
      stroke: this.stroke(),
      backgroundFill: this.backgroundFill(),
      backgroundStroke: this.backgroundStroke(),
      padding: this.padding(),
      declutterMode: this.declutterMode(),
    };
  }
}
