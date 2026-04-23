import { Component, Input, Host, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Icon } from 'ol/style';


import { StyleComponent } from './style.component';
import { IconAnchorUnits, IconOrigin } from 'ol/style/Icon';
import { Size } from 'ol/size';
import { Color } from 'ol/color';
import { DeclutterMode } from 'ol/style/Style';

@Component({
  selector: 'aol-style-icon',
  template: ` <div class="aol-style-icon"></div> `,
})
export class StyleIconComponent implements OnInit, OnChanges {
  @Input()
  anchor: [number, number];
  @Input()
  anchorXUnits: IconAnchorUnits;
  @Input()
  anchorYUnits: IconAnchorUnits;
  @Input()
  anchorOrigin: IconOrigin;
  @Input()
  color: string | Color;
  @Input()
  crossOrigin: string | null;
  @Input()
  img: HTMLCanvasElement | HTMLImageElement | ImageBitmap;
  @Input()
  displacement: number[];
  @Input()
  offset: [number, number];
  @Input()
  offsetOrigin: IconOrigin;
  @Input()
  opacity: number;
  @Input()
  width: number;
  @Input()
  height: number;
  @Input()
  scale: number | Size;
  @Input()
  declutterMode: DeclutterMode;
  @Input()
  rotateWithView: boolean;
  @Input()
  rotation: number;
  @Input()
  size: [number, number];
  @Input()
  src: string;

  public instance: Icon;

  constructor(@Host() private host: StyleComponent) {}

  ngOnInit() {
    // console.log('creating ol.style.Icon instance with: ', this);
    this.instance = new Icon(this);
    this.host.instance.setImage(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.instance) {
      return;
    }
    if (changes.opacity) {
      this.instance.setOpacity(changes.opacity.currentValue);
    }
    if (changes.rotation) {
      this.instance.setRotation(changes.rotation.currentValue);
    }
    if (changes.scale) {
      this.instance.setScale(changes.scale.currentValue);
    }
    if (changes.src) {
      this.instance = new Icon(this);
      this.host.instance.setImage(this.instance);
    }
    this.host.update();
    // console.log('changes detected in aol-style-icon: ', changes);
  }
}
