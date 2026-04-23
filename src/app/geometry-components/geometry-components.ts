import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate';
import { transform } from 'ol/proj';

@Component({
  selector: 'app-geometry-components',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './geometry-components.html',
  styleUrl: './geometry-components.less',
})
export class GeometryComponents {
  readonly center = signal<Coordinate>(transform([2.2, 46.4], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(6);

  readonly point = signal<[number, number]>([2.3522, 48.8566]);
  readonly lineString = signal<number[][]>([
    [-1.5536, 47.2184],
    [0.6889, 47.3941],
    [2.3522, 48.8566],
  ]);
  readonly polygon = signal<number[][][]>([
    [
      [4.2, 43.9],
      [5.9, 43.9],
      [5.9, 45.1],
      [4.2, 45.1],
      [4.2, 43.9],
    ],
  ]);
  readonly circleCenter = signal<[number, number]>([-0.5792, 44.8378]);
  readonly circleRadius = signal(70000);
  readonly multiPoint = signal<number[][]>([
    [-1.2, 46.1],
    [-0.8, 46.25],
    [-0.4, 46.1],
  ]);
  readonly multiLineString = signal<number[][][]>([
    [
      [6.0, 47.0],
      [6.6, 47.3],
      [7.0, 47.8],
    ],
    [
      [6.2, 46.7],
      [6.9, 46.9],
      [7.4, 47.4],
    ],
  ]);
  readonly multiPolygon = signal<number[][][][]>([
    [
      [
        [0.7, 43.1],
        [1.4, 42.8],
        [1.7, 43.4],
        [0.9, 43.6],
        [0.7, 43.1],
      ],
    ],
    [
      [
        [2.0, 42.7],
        [2.8, 42.5],
        [3.0, 43.0],
        [2.2, 43.2],
        [2.0, 42.7],
      ],
    ],
  ]);
}
