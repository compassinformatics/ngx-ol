import {
  Component,
  Optional,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
  input,
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
  readonly font = input<string | undefined>();
  readonly maxAngle = input<number | undefined>();
  readonly offsetX = input<number | undefined>();
  readonly offsetY = input<number | undefined>();
  readonly overflow = input<boolean | undefined>();
  readonly placement = input<TextPlacement | undefined>();
  readonly repeat = input<number | undefined>();
  readonly scale = input<number | Size | undefined>();
  readonly rotateWithView = input<boolean | undefined>();
  readonly rotation = input<number | undefined>();
  readonly text = input<string | string[] | undefined>();
  readonly textAlign = input<CanvasTextAlign | undefined>();
  readonly justify = input<TextJustify | undefined>();
  readonly textBaseline = input<CanvasTextBaseline | undefined>();
  readonly fill = input<Fill | undefined>();
  readonly stroke = input<Stroke | undefined>();
  readonly backgroundFill = input<Fill | undefined>();
  readonly backgroundStroke = input<Stroke | undefined>();
  readonly padding = input<number[] | undefined>();
  readonly declutterMode = input<DeclutterMode | undefined>();
  instance: Text;
  protected readonly _instanceSignal = signal<Text | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Text): Text {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }
  readonly componentType: string = 'style-text';

  constructor(@Optional() private readonly host: StyleComponent) {
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
    if (changes.offsetX) {
      this.instance.setOffsetX(changes.offsetX.currentValue);
    }
    if (changes.offsetY) {
      this.instance.setOffsetY(changes.offsetY.currentValue);
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
    if (changes.textBaseLine) {
      this.instance.setTextBaseline(changes.textBaseLine.currentValue);
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
