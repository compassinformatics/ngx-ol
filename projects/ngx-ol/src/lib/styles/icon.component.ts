import { Component, OnChanges, OnInit, SimpleChanges, inject, input, signal } from '@angular/core';
import Icon from 'ol/style/Icon.js';

import { StyleComponent } from './style.component';
import { IconAnchorUnits, IconOrigin, Options } from 'ol/style/Icon.js';
import { Size } from 'ol/size.js';
import { Color } from 'ol/color.js';
import { DeclutterMode } from 'ol/style/Style.js';

@Component({
  selector: 'aol-style-icon',
  template: ` <div class="aol-style-icon"></div> `,
})
export class StyleIconComponent implements OnInit, OnChanges {
  readonly anchor = input<[number, number]>();
  readonly anchorXUnits = input<IconAnchorUnits>();
  readonly anchorYUnits = input<IconAnchorUnits>();
  readonly anchorOrigin = input<IconOrigin>();
  readonly color = input<string | Color>();
  readonly crossOrigin = input<string | null>();
  readonly img = input<HTMLCanvasElement | HTMLImageElement | ImageBitmap>();
  readonly displacement = input<number[]>();
  readonly offset = input<[number, number]>();
  readonly offsetOrigin = input<IconOrigin>();
  readonly opacity = input<number>();
  readonly width = input<number>();
  readonly height = input<number>();
  readonly scale = input<number | Size>();
  readonly declutterMode = input<DeclutterMode>();
  readonly rotateWithView = input<boolean>();
  readonly rotation = input<number>();
  readonly size = input<[number, number]>();
  readonly src = input<string>();

  public instance: Icon;

  protected readonly _instanceSignal = signal<Icon | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Icon): Icon {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  private readonly host = inject(StyleComponent, { host: true });

  ngOnInit() {
    // console.log('creating ol.style.Icon instance with: ', this);
    this.setInstance(new Icon(this.createOptions()));
    this.host.instance.setImage(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.instance) {
      return;
    }
    if (changes.anchor) {
      this.instance.setAnchor(changes.anchor.currentValue);
    }
    if (changes.displacement) {
      this.instance.setDisplacement(changes.displacement.currentValue);
    }
    if (changes.opacity) {
      this.instance.setOpacity(changes.opacity.currentValue);
    }
    if (changes.rotateWithView?.currentValue !== undefined) {
      this.instance.setRotateWithView(changes.rotateWithView.currentValue);
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
