import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import type { Coordinate } from 'ol/coordinate';
import { transform } from 'ol/proj';

type DemoPoint = {
  x: number;
  y: number;
};

@Component({
  selector: 'app-cluster',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './cluster.html',
  styleUrl: './cluster.less',
})
export class Cluster {
  readonly center = signal<Coordinate>(
    transform([1.4886, 43.5554], 'EPSG:4326', 'EPSG:3857'),
  );
  readonly zoom = signal(14);
  readonly distance = signal(60);
  readonly pointFeatures = signal(this.createPointFeatures(2000));
  readonly pointCount = computed(() => this.pointFeatures().length);
  readonly extentFeature = signal(
    new Feature({
      geometry: new Polygon([
        [
          transform([1.47, 43.545], 'EPSG:4326', 'EPSG:3857'),
          transform([1.51, 43.545], 'EPSG:4326', 'EPSG:3857'),
          transform([1.51, 43.565], 'EPSG:4326', 'EPSG:3857'),
          transform([1.47, 43.565], 'EPSG:4326', 'EPSG:3857'),
          transform([1.47, 43.545], 'EPSG:4326', 'EPSG:3857'),
        ],
      ]),
    }),
  );

  protected setDistance(value: number): void {
    this.distance.set(value);
  }

  private createPointFeatures(total: number): Feature<Point>[] {
    return Array.from({ length: total }, () => {
      const point: DemoPoint = {
        x: this.randomInRange(1.47, 1.51, 4),
        y: this.randomInRange(43.545, 43.565, 4),
      };

      return new Feature({
        geometry: new Point(transform([point.x, point.y], 'EPSG:4326', 'EPSG:3857')),
      });
    });
  }

  private randomInRange(from: number, to: number, fixed: number): number {
    return Number((Math.random() * (to - from) + from).toFixed(fixed));
  }
}
