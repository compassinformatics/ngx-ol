import {
  Component,
  AfterContentInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  input,
  signal,
  inject,
} from '@angular/core';
import Graticule from 'ol/layer/Graticule.js';
import Stroke from 'ol/style/Stroke.js';
import { MapComponent } from './map.component';

@Component({
  selector: 'aol-graticule',
  template: '<ng-content></ng-content>',
})
export class GraticuleComponent implements AfterContentInit, OnChanges, OnDestroy {
  readonly strokeStyle = input<Stroke>();
  readonly showLabels = input<boolean>();
  readonly lonLabelPosition = input<number>();
  readonly latLabelPosition = input<number>();

  instance: Graticule;

  protected readonly _instanceSignal = signal<Graticule | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Graticule): Graticule {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  readonly componentType: string = 'graticule';

  private readonly map = inject(MapComponent);

  ngOnChanges(changes: SimpleChanges) {
    if (!this.instance) {
      return;
    }

    this.instance.setMap(null);
    this.setInstance(new Graticule(this.createOptions()));
    this.instance.setMap(this.map.instance);
  }

  ngAfterContentInit(): void {
    this.setInstance(new Graticule(this.createOptions()));
    this.instance.setMap(this.map.instance);
  }

  ngOnDestroy(): void {
    this.instance.setMap(null);
  }

  private createOptions() {
    return {
      strokeStyle: this.strokeStyle(),
      showLabels: this.showLabels(),
      lonLabelPosition: this.lonLabelPosition(),
      latLabelPosition: this.latLabelPosition(),
    };
  }
}
