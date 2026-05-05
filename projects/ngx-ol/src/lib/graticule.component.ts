import {
  signal,
  Component,
  Input,
  AfterContentInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import Graticule from 'ol/layer/Graticule';
import Stroke from 'ol/style/Stroke';
import { MapComponent } from './map.component';

@Component({
  selector: 'aol-graticule',
  template: '<ng-content></ng-content>',
})
export class GraticuleComponent implements AfterContentInit, OnChanges, OnDestroy {
  @Input() strokeStyle: Stroke;
  @Input() showLabels: boolean;
  @Input() lonLabelPosition: number;
  @Input() latLabelPosition: number;

  instance: any;

  protected readonly _instanceSignal = signal<any | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: any): any {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  public componentType = 'graticule';

  constructor(private map: MapComponent) {}

  ngOnChanges(changes: SimpleChanges) {
    const properties: { [index: string]: any } = {};

    if (!this.instance) {
      return;
    }

    for (const key in changes) {
      if (changes.hasOwnProperty(key)) {
        properties[key] = changes[key].currentValue;
      }
    }

    if (properties) {
      this.setInstance(new Graticule(properties));
    }
    this.instance.setMap(this.map.instance);
  }

  ngAfterContentInit(): void {
    this.setInstance(
      new Graticule({
        strokeStyle: this.strokeStyle,
        showLabels: this.showLabels,
        lonLabelPosition: this.lonLabelPosition,
        latLabelPosition: this.latLabelPosition,
      }),
    );
    this.instance.setMap(this.map.instance);
  }

  ngOnDestroy(): void {
    this.instance.setMap(null);
  }
}
