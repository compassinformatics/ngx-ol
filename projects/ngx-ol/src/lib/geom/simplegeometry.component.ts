import { Input, OnInit, Directive, signal } from '@angular/core';
import { FeatureComponent } from '../feature.component';
import { MapComponent } from '../map.component';
import SimpleGeometry from 'ol/geom/SimpleGeometry';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class SimpleGeometryComponent implements OnInit {
  @Input() srid: string;

  instance: SimpleGeometry;

  protected readonly _instanceSignal = signal<SimpleGeometry | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: SimpleGeometry): SimpleGeometry {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  public componentType = 'simple-geometry';

  protected constructor(
    protected map: MapComponent,
    protected host: FeatureComponent,
  ) {}

  ngOnInit() {
    this.host.instance.setGeometry(this.instance);
  }
}
