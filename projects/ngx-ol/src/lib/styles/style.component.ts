import { Component, OnChanges, Optional, OnInit, SimpleChanges, signal, input } from '@angular/core';
import Fill from 'ol/style/Fill';
import Image from 'ol/style/Image';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Geometry from 'ol/geom/Geometry';
import { FeatureComponent } from '../feature.component';
import { LayerVectorComponent } from '../layers/layervector.component';
import { GeometryFunction, Options, RenderFunction } from 'ol/style/Style';
import { LayerVectorImageComponent } from '../layers/layervectorimage.component';

@Component({
  selector: 'aol-style',
  template: ` <ng-content></ng-content> `,
})
export class StyleComponent implements OnInit, OnChanges {
  geometry = input<string | Geometry | GeometryFunction>();
  fill = input<Fill>();
  image = input<Image>();
  renderer = input<RenderFunction>();
  hitDetectionRenderer = input<RenderFunction>();
  stroke = input<Stroke>();
  text = input<Text>();
  zIndex = input<number>();
  instance: Style;
  protected readonly _instanceSignal = signal<Style | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Style): Style {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }
  public componentType = 'style';
  private readonly host: FeatureComponent | LayerVectorComponent;

  constructor(
    @Optional() featureHost: FeatureComponent,
    @Optional() vectorLayer: LayerVectorComponent,
    @Optional() vectorImageLayer: LayerVectorImageComponent,
  ) {
    // console.log('creating aol-style');
    this.host = featureHost || vectorLayer || vectorImageLayer;
    if (!this.host) {
      throw new Error('aol-style must be applied to a feature or a layer');
    }
  }

  update() {
    // console.log('updating style\'s host: ', this.host);
    this.host.instance.changed();
  }

  ngOnInit() {
    // console.log('creating aol-style instance with: ', this);
    this.setInstance(new Style(this.createOptions()));
    this.host.instance.setStyle(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.instance) {
      return;
    }

    if (changes.geometry) {
      this.instance.setGeometry(changes.geometry.currentValue);
    }
    if (changes.fill) {
      this.instance.setFill(changes.fill.currentValue);
    }
    if (changes.image) {
      this.instance.setImage(changes.image.currentValue);
    }
    if (changes.renderer) {
      this.instance.setRenderer(changes.renderer.currentValue ?? null);
    }
    if (changes.hitDetectionRenderer) {
      this.instance.setHitDetectionRenderer(changes.hitDetectionRenderer.currentValue ?? null);
    }
    if (changes.stroke) {
      this.instance.setStroke(changes.stroke.currentValue);
    }
    if (changes.text) {
      this.instance.setText(changes.text.currentValue);
    }
    if (changes.zIndex) {
      this.instance.setZIndex(changes.zIndex.currentValue);
    }

    this.update();
  }

  private createOptions(): Options {
    return {
      geometry: this.geometry(),
      fill: this.fill(),
      image: this.image(),
      renderer: this.renderer(),
      hitDetectionRenderer: this.hitDetectionRenderer(),
      stroke: this.stroke(),
      text: this.text(),
      zIndex: this.zIndex(),
    };
  }
}
