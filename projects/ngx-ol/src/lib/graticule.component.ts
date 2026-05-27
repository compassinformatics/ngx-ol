import {
  signal,
  Component,
  AfterContentInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  input,
} from '@angular/core';
import Graticule from 'ol/layer/Graticule';
import Stroke from 'ol/style/Stroke';
import { MapComponent } from './map.component';

interface GraticuleOptions {
  strokeStyle?: Stroke;
  showLabels?: boolean;
  lonLabelPosition?: number;
  latLabelPosition?: number;
}

@Component({
  selector: 'aol-graticule',
  template: '<ng-content></ng-content>',
})
export class GraticuleComponent implements AfterContentInit, OnChanges, OnDestroy {
  strokeStyle = input<Stroke>();
  showLabels = input<boolean>();
  lonLabelPosition = input<number>();
  latLabelPosition = input<number>();
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
    const requiresReload = Object.keys(changes).some((key) => !changes[key].firstChange);

    if (requiresReload && this.instance) {
      this.reloadInstance();
    }
  }

  ngAfterContentInit(): void {
    this.setInstance(new Graticule(this.createOptions()));
    this.instance.setMap(this.map.instance);
  }

  private reloadInstance(): void {
    this.instance.setMap(null);
    this.setInstance(new Graticule(this.createOptions()));
    this.instance.setMap(this.map.instance);
  }

  private createOptions(): GraticuleOptions {
    return {
      strokeStyle: this.strokeStyle(),
      showLabels: this.showLabels(),
      lonLabelPosition: this.lonLabelPosition(),
      latLabelPosition: this.latLabelPosition(),
    };
  }

  ngOnDestroy(): void {
    this.instance.setMap(null);
  }
}
