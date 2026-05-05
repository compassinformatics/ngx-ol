import { Component, Host, OnInit, OnChanges, SimpleChanges, signal, input } from '@angular/core';
import Icon from 'ol/style/Icon';

import { StyleComponent } from './style.component';
import { IconAnchorUnits, IconOrigin, Options } from 'ol/style/Icon';
import { Size } from 'ol/size';
import { Color } from 'ol/color';
import { DeclutterMode } from 'ol/style/Style';

@Component({
  selector: 'aol-style-icon',
  template: ` <div class="aol-style-icon"></div> `,
})
export class StyleIconComponent implements OnInit, OnChanges {
  anchor = input<[number, number]>();
  anchorXUnits = input<IconAnchorUnits>();
  anchorYUnits = input<IconAnchorUnits>();
  anchorOrigin = input<IconOrigin>();
  color = input<string | Color>();
  crossOrigin = input<string | null>();
  img = input<HTMLCanvasElement | HTMLImageElement | ImageBitmap>();
  displacement = input<number[]>();
  offset = input<[number, number]>();
  offsetOrigin = input<IconOrigin>();
  opacity = input<number>();
  width = input<number>();
  height = input<number>();
  scale = input<number | Size>();
  declutterMode = input<DeclutterMode>();
  rotateWithView = input<boolean>();
  rotation = input<number>();
  size = input<[number, number]>();
  src = input<string>();

  instance: Icon;

  protected readonly _instanceSignal = signal<Icon | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Icon): Icon {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }

  constructor(@Host() private host: StyleComponent) {}

  ngOnInit() {
    // console.log('creating ol.style.Icon instance with: ', this);
    this.setInstance(new Icon(this.createOptions()));
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
      this.setInstance(new Icon(this.createOptions()));
      this.host.instance.setImage(this.instance);
    }
    this.host.update();
    // console.log('changes detected in aol-style-icon: ', changes);
  }

  private createOptions(): Options {
    return {
      anchor: this.anchor(),
      anchorXUnits: this.anchorXUnits(),
      anchorYUnits: this.anchorYUnits(),
      anchorOrigin: this.anchorOrigin(),
      color: this.color(),
      crossOrigin: this.crossOrigin(),
      img: this.img(),
      displacement: this.displacement(),
      offset: this.offset(),
      offsetOrigin: this.offsetOrigin(),
      opacity: this.opacity(),
      width: this.width(),
      height: this.height(),
      scale: this.scale(),
      declutterMode: this.declutterMode(),
      rotateWithView: this.rotateWithView(),
      rotation: this.rotation(),
      size: this.size(),
      src: this.src(),
    };
  }
}
