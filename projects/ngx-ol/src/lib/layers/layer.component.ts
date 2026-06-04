import {
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
  Directive,
  input,
  signal,
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

  public instance: any;

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
    if (!this.instance) {
      return;
    }
    for (const key in changes) {
      if (changes.hasOwnProperty(key)) {
        const value = changes[key].currentValue;
        if (key === 'prerender') {
          if (changes[key].previousValue) {
            this.instance.un('prerender', changes[key].previousValue);
          }
          if (value) {
            this.instance.on('prerender', value);
          }
          continue;
        }
        if (key === 'postrender') {
          if (changes[key].previousValue) {
            this.instance.un('postrender', changes[key].previousValue);
          }
          if (value) {
            this.instance.on('postrender', value);
          }
          continue;
        }
        if (key === 'properties') {
          this.syncProperties(value, changes[key].previousValue);
          continue;
        }
        switch (key) {
          case 'extent':
            this.instance.setExtent(value);
            continue;
          case 'maxResolution':
            this.instance.setMaxResolution(value);
            continue;
          case 'minResolution':
            this.instance.setMinResolution(value);
            continue;
          case 'maxZoom':
            this.instance.setMaxZoom(value);
            continue;
          case 'minZoom':
            this.instance.setMinZoom(value);
            continue;
          case 'opacity':
            this.instance.setOpacity(value);
            continue;
          case 'visible':
            this.instance.setVisible(value);
            continue;
          case 'zIndex':
            this.instance.setZIndex(value);
            continue;
          default:
            break;
        }
      }
    }
  }

  private syncProperties(
    nextProperties?: Record<string, any>,
    previousProperties?: Record<string, any>,
  ) {
    if (previousProperties) {
      const nextKeys = new Set(Object.keys(nextProperties ?? {}));
      Object.keys(previousProperties)
        .filter((key) => !nextKeys.has(key))
        .forEach((key) => this.instance.unset(key, false));
    }

    if (nextProperties) {
      this.instance.setProperties(nextProperties, false);
    }
  }
}
