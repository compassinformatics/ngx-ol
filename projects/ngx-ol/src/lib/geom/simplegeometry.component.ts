import { Input, OnInit, Directive } from '@angular/core';
import { FeatureComponent } from '../feature.component';
import { MapComponent } from '../map.component';
import SimpleGeometry from 'ol/geom/SimpleGeometry';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class SimpleGeometryComponent implements OnInit {
  @Input() srid: string;

  public instance: SimpleGeometry;
  public componentType = 'simple-geometry';

  protected constructor(
    protected map: MapComponent,
    protected host: FeatureComponent,
  ) {}

  ngOnInit() {
    this.host.instance.setGeometry(this.instance);
  }
}
