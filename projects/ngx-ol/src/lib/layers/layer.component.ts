import {
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
  Directive,
  signal,
  input,
} from '@angular/core';
import Event from 'ol/events/Event';
import { MapComponent } from '../map.component';
import { LayerGroupComponent } from './layergroup.component';
import { Extent } from 'ol/extent';
import { RenderFunction } from 'ol/layer/Layer';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class LayerComponent implements OnInit, OnChanges, OnDestroy {
  id = input<string | number>();
  className = input<string>();
  opacity = input<number>();
  visible = input<boolean>();
  extent = input<Extent>();
  zIndex = input<number>();
  minResolution = input<number>();
  maxResolution = input<number>();
  minZoom = input<number>();
  maxZoom = input<number>();
  render = input<RenderFunction>();
  properties = input<Record<string, any>>();
  prerender = input<(evt: Event) => void>();
  postrender = input<(evt: Event) => void>();
  instance: any;
  protected readonly _instanceSignal = signal<any | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: any): any {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }
  public componentType = 'layer';

  protected constructor(protected host: MapComponent | LayerGroupComponent) {}

  protected createLayerOptions() {
    return {
      className: this.className(),
      opacity: this.opacity(),
      visible: this.visible(),
      extent: this.extent(),
      zIndex: this.zIndex(),
      minResolution: this.minResolution(),
      maxResolution: this.maxResolution(),
      minZoom: this.minZoom(),
      maxZoom: this.maxZoom(),
      render: this.render(),
      properties: this.properties(),
    };
  }

  ngOnInit() {
    if (this.prerender() !== null && this.prerender() !== undefined) {
      this.instance.on('prerender', this.prerender());
    }
    if (this.postrender() !== null && this.postrender() !== undefined) {
      this.instance.on('postrender', this.postrender());
    }
    this.host.instance.getLayers().push(this.instance);
  }

  ngOnDestroy() {
    this.host.instance.getLayers().remove(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    const properties: { [index: string]: any } = {};
    if (!this.instance) {
      return;
    }
    for (const key in changes) {
      if (changes.hasOwnProperty(key)) {
        properties[key] = changes[key].currentValue;
        if (key === 'prerender') {
          this.instance.un('prerender', changes[key].previousValue);
          this.instance.on('prerender', changes[key].currentValue);
        }
        if (key === 'postrender') {
          this.instance.un('postrender', changes[key].previousValue);
          this.instance.on('postrender', changes[key].currentValue);
        }
      }
    }
    // console.log('changes detected in aol-layer, setting new properties: ', properties);
    this.instance.setProperties(properties, false);
  }
}
