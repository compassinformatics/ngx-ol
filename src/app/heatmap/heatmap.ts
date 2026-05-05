import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  AngularOpenlayersMapModule,
  AngularOpenlayersTileLayersModule,
  AngularOpenlayersVectorLayersModule,
} from 'ngx-ol';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';

@Component({
  selector: 'app-heatmap',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AngularOpenlayersMapModule,
    AngularOpenlayersTileLayersModule,
    AngularOpenlayersVectorLayersModule,
  ],
  templateUrl: './heatmap.html',
  styleUrl: './heatmap.less',
})
export class Heatmap {
  readonly center = signal(fromLonLat([-8.2, 53.45]));
  readonly zoom = signal(7);
  readonly radius = signal(18);
  readonly blur = signal(22);
  readonly features = signal(this.createFeatures());

  protected setRadius(radius: number): void {
    if (!Number.isNaN(radius)) {
      this.radius.set(radius);
    }
  }

  protected setBlur(blur: number): void {
    if (!Number.isNaN(blur)) {
      this.blur.set(blur);
    }
  }

  private createFeatures(): Feature[] {
    return [
      this.createWeightedFeature(-6.2603, 53.3498, 1),
      this.createWeightedFeature(-9.0568, 53.2707, 0.85),
      this.createWeightedFeature(-8.4863, 51.8985, 0.75),
      this.createWeightedFeature(-7.1119, 52.2593, 0.65),
      this.createWeightedFeature(-6.4133, 52.3369, 0.55),
      this.createWeightedFeature(-7.6901, 53.2734, 0.7),
      this.createWeightedFeature(-8.63, 52.6647, 0.8),
      this.createWeightedFeature(-8.9467, 53.1424, 0.6),
    ];
  }

  private createWeightedFeature(longitude: number, latitude: number, weight: number): Feature {
    return new Feature({
      geometry: new Point(fromLonLat([longitude, latitude])),
      weight,
    });
  }
}
