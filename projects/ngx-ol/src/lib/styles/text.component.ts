import { Component, Input, Optional, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Fill, Stroke, Text } from 'ol/style';
import { StyleComponent } from './style.component';
import { TextJustify, TextPlacement } from 'ol/style/Text';
import { DeclutterMode } from 'ol/style/Style';

@Component({
  selector: 'aol-style-text',
  template: ` <div class="aol-style-text"></div> `,
})
export class StyleTextComponent implements OnInit, OnChanges {
  @Input()
  font: string | undefined;
  @Input()
  maxAngle: number | undefined;
  @Input()
  offsetX: number | undefined;
  @Input()
  offsetY: number | undefined;
  @Input()
  overflow: boolean | undefined;
  @Input()
  placement: TextPlacement | undefined;
  @Input()
  repeat: number | undefined;
  @Input()
  scale: number | undefined;
  @Input()
  rotateWithView: boolean | undefined;
  @Input()
  rotation: number | undefined;
  @Input()
  text: string | string[] | undefined;
  @Input()
  textAlign: CanvasTextAlign | undefined;
  @Input()
  justify: TextJustify | undefined;
  @Input()
  textBaseline: CanvasTextBaseline | undefined;
  @Input()
  fill: Fill | undefined;
  @Input()
  stroke: Stroke | undefined;
  @Input()
  backgroundFill: Fill | undefined;
  @Input()
  backgroundStroke: Stroke | undefined;
  @Input()
  padding: number[] | undefined;
  @Input()
  declutterMode: DeclutterMode | undefined;

  public instance: Text;
  public componentType = 'style-text';

  constructor(@Optional() private host: StyleComponent) {
    if (!host) {
      throw new Error('aol-style-text must be a descendant of aol-style');
    }
    // console.log('creating aol-style-text with: ', this);
  }

  ngOnInit() {
    // console.log('creating ol.style.Text instance with: ', this);
    this.instance = new Text(this);
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
}
