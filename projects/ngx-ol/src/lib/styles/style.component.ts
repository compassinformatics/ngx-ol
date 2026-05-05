import { Component, Input, Optional, OnInit, signal } from '@angular/core';
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
export class StyleComponent implements OnInit {
  @Input() geometry?: string | Geometry | GeometryFunction;
  @Input() fill?: Fill;
  @Input() image?: Image;
  @Input() renderer?: RenderFunction;
  @Input() hitDetectionRenderer?: RenderFunction;
  @Input() stroke?: Stroke;
  @Input() text?: Text;
  @Input() zIndex?: number;

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

  private createOptions(): Options {
    return {
      geometry: this.geometry,
      fill: this.fill,
      image: this.image,
      renderer: this.renderer,
      hitDetectionRenderer: this.hitDetectionRenderer,
      stroke: this.stroke,
      text: this.text,
      zIndex: this.zIndex,
    };
  }
}
