import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  AngularOpenlayersMapModule,
  AngularOpenlayersTileLayersModule,
  AngularOpenlayersVectorLayersModule,
} from 'ngx-ol';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

@Component({
  selector: 'app-regular-shape',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AngularOpenlayersMapModule,
    AngularOpenlayersTileLayersModule,
    AngularOpenlayersVectorLayersModule,
  ],
  templateUrl: './regular-shape.html',
  styleUrl: './regular-shape.less',
})
export class RegularShapeDemo {
  readonly center = signal(fromLonLat([-8.2, 53.45]));
  readonly zoom = signal(7);
  readonly points = signal(5);
  readonly radius = signal(14);
  readonly radius2 = signal(7);
  readonly features = signal(this.createFeatures());
  readonly fill = new Fill({ color: 'rgba(202, 138, 4, 0.72)' });
  readonly stroke = new Stroke({ color: '#854d0e', width: 2 });

  protected setPoints(points: number): void {
    if (!Number.isNaN(points)) {
      this.points.set(points);
    }
  }

  protected setRadius(radius: number): void {
    if (!Number.isNaN(radius)) {
      this.radius.set(radius);
    }
  }

  protected setRadius2(radius2: number): void {
    if (!Number.isNaN(radius2)) {
      this.radius2.set(radius2);
    }
  }

  private createFeatures(): Feature[] {
    return [
      new Feature({ geometry: new Point(fromLonLat([-9.0568, 53.2707])) }),
      new Feature({ geometry: new Point(fromLonLat([-8.6267, 52.6647])) }),
      new Feature({ geometry: new Point(fromLonLat([-7.1119, 52.2593])) }),
      new Feature({ geometry: new Point(fromLonLat([-6.4133, 52.3369])) }),
    ];
  }
}
